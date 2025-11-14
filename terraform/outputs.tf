output "website_url" {
  value       = "http://${aws_lb.public.dns_name}"
  description = "The public URL for the RoamRush website"
}

output "ecr_backend_url" {
  value       = aws_ecr_repository.backend.repository_url
  description = "The URL for the backend ECR repository"
}

output "ecr_frontend_url" {
  value       = aws_ecr_repository.frontend.repository_url
  description = "The URL for the frontend ECR repository"
}

output "backend_internal_url" {
  value = "http://${aws_lb.internal.dns_name}:8080"
}