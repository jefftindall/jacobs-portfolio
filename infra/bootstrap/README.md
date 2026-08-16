# Bootstrap Terraform remote state + Terraform OIDC (run once, local state).
#
#   export GH_TOKEN="$(gh auth token)"   # needs admin access to repo variables
#   cd infra/bootstrap
#   terraform init -input=false
#   terraform plan -input=false -out=tfplan
#   terraform apply tfplan
#
# Creates:
#   Resource group:    rg-jacob-tfstate
#   Storage account:   stjacobtfstateeu2
#   Container:         tfstate
#   Shared RG/vault:   rg-jacob-shared / kv-jacob-shared (SITE-*, Turnstile, ACS, ALERT-*, GA-*, GSC-*)
#   Shared ACS:        acs-jacob-shared + email-jacob-shared (one MailFrom / SMS number)
#   Subscription budget: budget-jacob-portfolio-monthly (ceil(expected×1.25), currently $34/mo; ALERT-EMAIL at 80%/100%)
#   Region:            eastus2
#   Subscription:      bf40ce12-d60e-4d58-8954-9f43445ca2af
#   Entra app:         jacob-portfolio-gha-terraform (OIDC for plan/apply)
#   Repo variables:    AZURE_TF_CLIENT_ID, AZURE_TF_TENANT_ID, AZURE_TF_SUBSCRIPTION_ID,
#                      AZURE_SHARED_KEY_VAULT_NAME
#
# Also grant the Terraform SP Key Vault Secrets Officer (subscription) so Actions
# can refresh azurerm_key_vault_secret resources. Add repo secret TF_GITHUB_TOKEN
# (PAT with environment variable access) for the GitHub provider in CI.
#
# Staging/prod backends are preconfigured to use this account with distinct state keys.
# Apply bootstrap first (it does not require env GitHub Actions apps). Then apply
# staging and prod; each env grants its own GHA identity on kv-jacob-shared.
# Re-apply bootstrap after pulling OIDC / shared vault / budget changes so Actions can run Terraform.
# Populate shared vault secrets per docs/runbooks/rotate-secrets.md before CD builds.
# Set ALERT-EMAIL before expecting budget threshold emails (otherwise Owners are notified).
# GA-PROPERTY-ID / GA-DATA-API-SA-JSON: see docs/runbooks/ga-data-api-access.md (OPS-P5 scorecard).
# GSC-SITE-URL starts as REPLACE_ME until a public domain exists; GSC-DATA-API-SA-JSON falls back to GA SA:
#   docs/runbooks/gsc-data-api-access.md (SEARCH-P4 search signals).
