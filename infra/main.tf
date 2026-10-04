terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

provider "github" {
  owner = var.github_owner
}

resource "github_repository_pages" "quiz_app_pages" {
  repository = var.repository_name
  build_type = "workflow"
}