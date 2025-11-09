# --- 1. Backend Task Definition ---
resource "aws_ecs_task_definition" "backend" {
  family                   = "roamrush-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024 # 1 vCPU
  memory                   = 2048 # 2GB RAM
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  # This is the container definition
  container_definitions = jsonencode([
    {
      name      = "roamrush-backend"
      image     = "${aws_ecr_repository.backend.repository_url}:latest" # Placeholder
      cpu       = 1024
      memory    = 2048
      portMappings = [{ containerPort = 8080 }]
      
      # --- This is the magic part ---
      # We pass secrets securely, not as plain-text env vars
      secrets = [
        { name = "DB_HOST", valueFrom = aws_db_instance.postgres.address },
        { name = "DB_PORT", valueFrom = "5432" },
        { name = "DB_NAME", valueFrom = aws_db_instance.postgres.db_name },
        { name = "DB_USER", valueFrom = aws_db_instance.postgres.username },
        { name = "DB_PASS", valueFrom = aws_secretsmanager_secret.postgres.arn },
        { name = "MONGO_HOST", valueFrom = aws_docdb_cluster.mongo.endpoint },
        { name = "MONGO_PORT", valueFrom = tostring(aws_docdb_cluster.mongo.port) },
        { name = "MONGO_DB_NAME", valueFrom = "roamrush_social" },
        { name = "MONGO_USER", valueFrom = aws_docdb_cluster.mongo.master_username },
        { name = "MONGO_PASS", valueFrom = aws_secretsmanager_secret.mongo.arn },
        { name = "JWT_SECRET", valueFrom = "your-production-jwt-secret-here-or-from-secrets-manager" }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/roamrush-backend"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# --- 2. Backend ECS Service ---
resource "aws_ecs_service" "backend" {
  name            = "roamrush-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2 # Run 2 copies for high availability
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = data.aws_subnets.default.ids
    security_groups = [aws_security_group.backend_ecs.id]
  }
  
  # Connect this service to the INTERNAL load balancer
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "roamrush-backend"
    container_port   = 8080
  }
}

# --- 3. Frontend Task Definition ---
resource "aws_ecs_task_definition" "frontend" {
  family                   = "roamrush-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512 # 0.5 vCPU
  memory                   = 1024 # 1GB RAM
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "roamrush-frontend"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest" # Placeholder
      cpu       = 512
      memory    = 1024
      portMappings = [{ containerPort = 3000 }]
      
      environment = [
        # Tell the Next.js app the *private* DNS name of the backend ALB
        { name = "API_BASE_URL", value = "http://${aws_lb.internal.dns_name}:8080" }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/roamrush-frontend"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# --- 4. Frontend ECS Service ---
resource "aws_ecs_service" "frontend" {
  name            = "roamrush-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = data.aws_subnets.default.ids
    security_groups = [aws_security_group.frontend_ecs.id]
    assign_public_ip = true # Give these containers a public IP
  }
  
  # Connect this service to the PUBLIC load balancer
  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "roamrush-frontend"
    container_port   = 3000
  }
}