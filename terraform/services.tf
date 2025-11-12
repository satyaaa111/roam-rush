# --- Create the log groups FIRST ---
resource "aws_cloudwatch_log_group" "backend_logs" {
  name = "/ecs/roamrush-backend-${terraform.workspace}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "frontend_logs" {
  name = "/ecs/roamrush-frontend-${terraform.workspace}"
  retention_in_days = 7
}
# -----------------------------

# --- 1. Backend Task Definition ---
resource "aws_ecs_task_definition" "backend" {
  family                   = "roamrush-backend-task-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024 
  memory                   = 2048 
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "roamrush-backend"
      image     = "${aws_ecr_repository.backend.repository_url}:latest" 
      cpu       = 1024
      memory    = 2048
      portMappings = [{ containerPort = 8080 }]
      
      # Plain-text configuration
      "environment" : [
        { "name": "DB_HOST", "value": aws_db_instance.postgres.address },
        { "name": "DB_PORT", "value": "5432" },
        { "name": "DB_NAME", "value": aws_db_instance.postgres.db_name },
        { "name": "DB_USER", "value": aws_db_instance.postgres.username },
        { "name": "MONGO_HOST", "value": aws_docdb_cluster.mongo.endpoint },
        { "name": "MONGO_PORT", "value": tostring(aws_docdb_cluster.mongo.port) },
        { "name": "MONGO_DB_NAME", "value": "roamrush_social" },
        { "name": "MONGO_USER", "value": aws_docdb_cluster.mongo.master_username }
      ],
      
      # Secure, encrypted secrets
      "secrets" : [
        { "name": "DB_PASS", "valueFrom": aws_secretsmanager_secret.postgres.arn },
        { "name": "MONGO_PASS", "valueFrom": aws_secretsmanager_secret.mongo.arn },
        { "name": "JWT_SECRET", "valueFrom": aws_secretsmanager_secret.jwt_secret.arn }
      ],

      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group"         : aws_cloudwatch_log_group.backend_logs.name,
          "awslogs-region"        : "ap-south-1",
          "awslogs-stream-prefix" : "ecs"
        }
      }
    }
  ])

  depends_on = [aws_cloudwatch_log_group.backend_logs]
}

# --- 2. Backend ECS Service ---
resource "aws_ecs_service" "backend" {
  name            = "roamrush-backend-service-${terraform.workspace}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2 
  launch_type     = "FARGATE"
  enable_execute_command = true

  network_configuration {
    subnets         = data.aws_subnets.default.ids
    security_groups = [aws_security_group.backend_ecs.id]
    assign_public_ip = true
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "roamrush-backend"
    container_port   = 8080
  }
  
  deployment_controller {
    type = "ECS"
  }
  depends_on = [
    aws_lb_listener.backend,
    aws_security_group.database
  ]
}

# --- 3. Frontend Task Definition ---
resource "aws_ecs_task_definition" "frontend" {
  family                   = "roamrush-frontend-task-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512 
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "roamrush-frontend"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest"
      cpu       = 512
      memory    = 1024
      portMappings = [{ containerPort = 3000 }]
      
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "API_BASE_URL", value = "http://${aws_lb.internal.dns_name}:8080" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         : aws_cloudwatch_log_group.frontend_logs.name,
          "awslogs-region"        : "ap-south-1",
          "awslogs-stream-prefix" : "ecs"
        }
      }
    }
  ])
  
  depends_on = [aws_cloudwatch_log_group.frontend_logs]
}

# --- 4. Frontend ECS Service ---
resource "aws_ecs_service" "frontend" {
  name            = "roamrush-frontend-service-${terraform.workspace}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = data.aws_subnets.default.ids
    security_groups = [aws_security_group.frontend_ecs.id]
    assign_public_ip = true 
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "roamrush-frontend"
    container_port   = 3000
  }
  
  deployment_controller {
    type = "ECS"
  }
  depends_on = [aws_lb_listener.frontend]
}