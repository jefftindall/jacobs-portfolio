variable "subscription_id" {
  type        = string
  description = "Azure subscription targeted by this Terraform stack"
  default     = "bf40ce12-d60e-4d58-8954-9f43445ca2af"
}

variable "location" {
  type        = string
  description = "Azure region for all resources"
  default     = "eastus2"
}

variable "custom_domain" {
  type        = string
  description = "Production custom domain (apex). Merging to main applies this via CD."
  default     = "jaketindall.com"
}

variable "additional_auth_hostnames" {
  type        = list(string)
  description = "Extra hostnames allowed to complete Entra sign-in (Azure SWA hostname is added automatically)"
  default     = []
}

variable "github_owner" {
  type        = string
  description = "GitHub org or user that owns the portfolio repo"
  default     = "jefftindall"
}

variable "github_owner_id" {
  type        = string
  description = "Numeric GitHub owner ID for OIDC subject claims"
  default     = "10339968"
}

variable "github_repo" {
  type    = string
  default = "jacobs-portfolio"
}

variable "github_repo_id" {
  type        = string
  description = "Numeric GitHub repository ID for OIDC subject claims"
  default     = "1336264113"
}

variable "github_branch" {
  type        = string
  description = "Branch Studio commits to / prod deploys from"
  default     = "main"
}

variable "manage_github_actions" {
  type        = bool
  description = "Create GitHub Actions environment variables via Terraform (needs GITHUB_TOKEN/GH_TOKEN)"
  default     = true
}

variable "ga_measurement_id" {
  type        = string
  description = "Optional GA4 Measurement ID (empty until analytics is enabled)"
  default     = ""
}

