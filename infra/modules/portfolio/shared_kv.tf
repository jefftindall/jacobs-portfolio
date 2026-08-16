# Shared foundation vault (bootstrap) — site-build, Turnstile, ACS, and ALERT-* ops
# contacts identical across staging and prod so a single release artifact / one SMS
# number / one on-call set is shared.
# This env’s GitHub Actions OIDC identity is granted Key Vault Secrets User here
# (not in bootstrap) so first-time bootstrap does not need the env apps to exist yet.

data "azurerm_key_vault" "shared" {
  name                = var.shared_key_vault_name
  resource_group_name = var.shared_key_vault_resource_group_name
}

resource "azurerm_role_assignment" "github_actions_shared_kv_secrets_user" {
  scope                = data.azurerm_key_vault.shared.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azuread_service_principal.github_actions.object_id
}

data "azurerm_key_vault_secret" "site_contact_email" {
  name         = "SITE-CONTACT-EMAIL"
  key_vault_id = data.azurerm_key_vault.shared.id
}

data "azurerm_key_vault_secret" "site_contact_phone" {
  name         = "SITE-CONTACT-PHONE"
  key_vault_id = data.azurerm_key_vault.shared.id
}

data "azurerm_key_vault_secret" "turnstile_secret_key" {
  name         = "TURNSTILE-SECRET-KEY"
  key_vault_id = data.azurerm_key_vault.shared.id
}

# Ops Action Group contacts (OPS-P1-*). Placeholders (REPLACE_ME) skip receivers in monitoring.tf.
data "azurerm_key_vault_secret" "alert_email" {
  name         = "ALERT-EMAIL"
  key_vault_id = data.azurerm_key_vault.shared.id
}

data "azurerm_key_vault_secret" "alert_sms_phone" {
  name         = "ALERT-SMS-PHONE"
  key_vault_id = data.azurerm_key_vault.shared.id
}

data "azurerm_key_vault_secret" "alert_voice_phone" {
  name         = "ALERT-VOICE-PHONE"
  key_vault_id = data.azurerm_key_vault.shared.id
}
