resource "aws_s3_bucket" "uploads" {
  # This line creates a unique bucket name like "roamrush-user-uploads-a1b2c3d4"
  bucket = "roamrush-user-uploads-${random_id.bucket_prefix.hex}"
}

# --- THIS IS THE FIX ---
# We create a new, separate resource to manage the public access block
# and link it to the bucket using its ID.
resource "aws_s3_bucket_public_access_block" "uploads_pab" {
  bucket = aws_s3_bucket.uploads.id # <-- This links it to the bucket above

  # All the settings now go in here
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
# -----------------------

resource "random_id" "bucket_prefix" {
  byte_length = 8
}