# --- 1. The ECS Cluster ---
resource "aws_ecs_cluster" "main" {
  name = "roamrush-cluster-${terraform.workspace}"
}

# --- 2. IAM Roles for Fargate ---
# This is now a "resource" block, which is what services.tf expects
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "roamrush-ecs-task-exec-role-${terraform.workspace}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# --- 3. The PUBLIC Load Balancer (for Frontend) ---
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

# --- 4. The INTERNAL Load Balancer (for Backend) ---
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
    path = "/api/v1/test"
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