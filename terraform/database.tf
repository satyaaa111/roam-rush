# --- 1. Store Passwords Securely in AWS Secrets Manager ---
resource "random_password" "postgres_pass" {
  length  = 16
  special = false
}

resource "random_password" "mongo_pass" {
  length  = 16
  special = false
}

resource "aws_secretsmanager_secret" "postgres" {
  name        = "roamrush/v/postgres/password-${terraform.workspace}" # v fix
  description = "Password for RoamRush Postgres DB (${terraform.workspace})"
}

resource "aws_secretsmanager_secret_version" "postgres_pass_version" {
  secret_id     = aws_secretsmanager_secret.postgres.id
  secret_string = random_password.postgres_pass.result
}

resource "aws_secretsmanager_secret" "mongo" {
  name        = "roamrush/v/mongo/password-${terraform.workspace}" # v fix
  description = "Password for RoamRush DocumentDB (${terraform.workspace})"
}

resource "aws_secretsmanager_secret_version" "mongo_pass_version" {
  secret_id     = aws_secretsmanager_secret.mongo.id
  secret_string = random_password.mongo_pass.result
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name        = "roamrush/v/jwt/secret-${terraform.workspace}" # v fix
  description = "JWT Secret Key for RoamRush (${terraform.workspace})"
}

resource "aws_secretsmanager_secret_version" "jwt_secret_version" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = "M-s4cr3t-k3y-f0r-HS256-n33ds-t0-b3-v3ry-L0NG-and-R@nd0m-!@#$"
}

# --- 2. Create the PostgreSQL Database (RDS) ---
resource "aws_db_subnet_group" "postgres" {
  name       = "roamrush-postgres-subnet-group-${terraform.workspace}"
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_db_instance" "postgres" {
  identifier           = "roamrush-postgres-db-${terraform.workspace}"
  instance_class       = "db.t3.micro"
  engine               = "postgres"
  engine_version       = "14"
  allocated_storage    = 20
  db_name              = "roamrush_db"
  username             = "roamrushadmin"
  password             = random_password.postgres_pass.result
  db_subnet_group_name = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.database.id]
  publicly_accessible  = false
  skip_final_snapshot  = true
}

resource "aws_secretsmanager_secret" "mail_password" {
  name        = "roamrush/v/mail/password-${terraform.workspace}"
  description = "SMTP Password for RoamRush (${terraform.workspace})"
}

resource "aws_secretsmanager_secret_version" "mail_password_version" {
  secret_id     = aws_secretsmanager_secret.mail_password.id
  secret_string = "jrzczsqlratdymvl" 
}

# --- 3. Create the MongoDB-compatible Database (DocumentDB) ---
resource "aws_docdb_subnet_group" "mongo" {
  name       = "roamrush-docdb-subnet-group-${terraform.workspace}"
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_docdb_cluster" "mongo" {
  cluster_identifier      = "roamrush-docdb-cluster-${terraform.workspace}"
  engine_version          = "5.0.0"
  master_username         = "roamrushadmin"
  master_password         = random_password.mongo_pass.result
  db_subnet_group_name    = aws_docdb_subnet_group.mongo.name
  vpc_security_group_ids  = [aws_security_group.database.id]
  skip_final_snapshot     = true
}

resource "aws_docdb_cluster_instance" "mongo_instance" {
  count                = 1
  identifier           = "roamrush-docdb-instance-${terraform.workspace}"
  cluster_identifier   = aws_docdb_cluster.mongo.id
  instance_class       = "db.t3.medium"
}