##############################################
# ECS CLUSTER + IAM + LOAD BALANCER CONFIG
# (Corrected & Production Ready)
##############################################

# --- 1. The ECS Cluster ---
resource "aws_ecs_cluster" "main" {
  name = "roamrush-cluster-${terraform.workspace}"
}

# --- 2a. IAM Role for Fargate ---
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "roamrush-ecs-task-exec-role-${terraform.workspace}"
  
  # This trust relationship allows ECS to assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# --- 2b. The IAM Policy (Permissions for ECS Task Execution Role) ---
data "aws_iam_policy_document" "ecs_task_exec_policy_doc" {

  # --- ECR Permissions ---
  statement {
    effect    = "Allow"
    actions   = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ]
    resources = ["*"]
  }

  # --- CloudWatch Logs Permissions ---
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel",
      "ssm:DescribeSessions",
      "ssm:GetParameters",
      "ecs:ExecuteCommand"
    ]
    resources = ["*"]
  }

  # --- Secrets Manager Permissions ---
  statement {
    effect  = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]
    resources = [
      aws_secretsmanager_secret.postgres.arn,
      aws_secretsmanager_secret.mongo.arn,
      aws_secretsmanager_secret.jwt_secret.arn,
      aws_secretsmanager_secret.mail_password.arn 
    ]
  }
}

# --- 2c. Create IAM Policy in AWS ---
resource "aws_iam_policy" "ecs_task_exec_policy" {
  name   = "roamrush-ecs-task-exec-policy-${terraform.workspace}"
  policy = data.aws_iam_policy_document.ecs_task_exec_policy_doc.json
}

# --- 2d. Attach Custom Policy to ECS Role ---
resource "aws_iam_role_policy_attachment" "ecs_task_exec_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_exec_policy.arn
}

resource "aws_iam_role" "ecs_task_role" {
  name = "roamrush-ecs-task-role-${terraform.workspace}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# Allow ECS containers to read from Secrets Manager (runtime)
resource "aws_iam_role_policy_attachment" "ecs_task_role_secrets" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

##############################################
# LOAD BALANCERS (Public for Frontend / Internal for Backend)
##############################################

# --- 3. The PUBLIC Load Balancer (Frontend) ---
resource "aws_lb" "public" {
  name               = "roamrush-public-alb-${terraform.workspace}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_public.id]
  subnets            = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "frontend" {
  name        = "roamrush-frontend-tg-${terraform.workspace}"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"
  
  health_check {
    path = "/"
  }
}

resource "aws_lb_listener" "frontend" {
  load_balancer_arn = aws_lb.public.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# --- 4. The INTERNAL Load Balancer (Backend) ---
resource "aws_lb" "internal" {
  name               = "roamrush-internal-alb-${terraform.workspace}"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_internal.id]
  subnets            = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "backend" {
  name        = "roamrush-backend-tg-${terraform.workspace}"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"
  
  health_check {
    path = "/actuator/health"
  }
}

resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.internal.arn
  port              = 8080
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}
