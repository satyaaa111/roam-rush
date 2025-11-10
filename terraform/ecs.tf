# --- 1. The ECS Cluster ---
resource "aws_ecs_cluster" "main" {
  name = "roamrush-cluster"
}

# --- 2. IAM Roles for Fargate ---
# We are now FINDING the global role, not creating it
data "aws_iam_role" "ecs_task_execution_role" {
  name = "roamrush-ecs-task-execution-role"
}
# --- 3. The PUBLIC Load Balancer (for Frontend) ---
resource "aws_lb" "public" {
  name               = "roamrush-public-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_public.id]
  subnets            = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "frontend" {
  name     = "roamrush-frontend-tg"
  port     = 3000 # Next.js port
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"
  
  health_check {
    path = "/" # Check the homepage
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
  name               = "roamrush-internal-alb"
  internal           = true # <-- CRITICAL: Not open to the internet
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_internal.id]
  subnets            = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "backend" {
  name     = "roamrush-backend-tg"
  port     = 8080 # Spring Boot port
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"
  
  health_check {
    path = "/api/v1/test" # Our protected health check
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