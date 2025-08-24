"use client"

import { toast } from "sonner"
import type { FunctionResponse } from "./types/models"

type ToastHandlingProps = {
  response: FunctionResponse
  category: "account" | "products"
}

export function toastHandling({
  response,
  category,
}: ToastHandlingProps): boolean {
  if (!response.type) {
    return true
  }

  switch (category) {
    case "account":
      switch (response.type) {
        case "user_password_mismatch":
          toast.error(
            "Passwords do not match. Please check the password and confirm password."
          )
          return false
        case "password_recently_used":
          toast.error(
            "The password you are trying to use is similar to your previous password. For your security, please choose a different password and try again."
          )
          return false
        case "password_personal_data":
          toast.error(
            "The password you are trying to use contains references to your name, email, phone or userID. For your security, please choose a different password and try again."
          )
          return false
        case "user_phone_not_found":
          toast.error(
            "The current user does not have a phone number associated with their account."
          )
          return false
        case "user_missing_id":
          toast.error("Missing ID from OAuth2 provider.")
          return false
        case "user_oauth2_bad_request":
          toast.error("OAuth2 provider rejected the bad request.")
          return false
        case "user_jwt_invalid":
          toast.error("The JWT token is invalid.")
          return false
        case "user_blocked":
          toast.error("The current user has been blocked.")
          return false
        case "user_invalid_token":
          toast.error("Invalid token passed in the request.")
          return false
        case "user_email_not_whitelisted":
          toast.error("E-Mail not whitelisted.")
          return false
        case "user_invalid_code":
          toast.error("The specified code is not valid.")
          return false
        case "user_ip_not_whitelisted":
          toast.error("IP not whitelisted.")
          return false
        case "user_invalid_credentials":
          toast.error(
            "Invalid credentials. Please check the email and password."
          )
          return false
        case "user_anonymous_console_prohibited":
          toast.error("Anonymous users are not allowed to sign in.")
          return false
        case "user_session_already_exists":
          toast.error("Session already exists. Please logout first.")
          return false
        case "user_unauthorized":
          toast.error(
            "The current user is not authorized to perform the requested action."
          )
          return false
        case "user_oauth2_unauthorized":
          toast.error("OAuth2 provider rejected the unauthorized request.")
          return false
        case "team_invalid_secret":
          toast.error(
            "The team invitation secret is invalid. Please request a new invitation and try again."
          )
          return false
        case "team_invite_mismatch":
          toast.error("The invite does not belong to the current user.")
          return false
        case "user_not_found":
          toast.error("User with the requested ID could not be found.")
          return false
        case "user_session_not_found":
          toast.error("The current user session could not be found.")
          return false
        case "user_identity_not_found":
          toast.error(
            "The identity could not be found. Please sign in with OAuth provider to create identity first."
          )
          return false
        case "team_not_found":
          toast.error("Team with the requested ID could not be found.")
          return false
        case "team_invite_not_found":
          toast.error("The requested team invitation could not be found.")
          return false
        case "team_membership_mismatch":
          toast.error("The membership ID does not belong to the team ID.")
          return false
        case "membership_not_found":
          toast.error("Membership with the requested ID could not be found.")
          return false
        case "user_already_exists":
          toast.error(
            "A user with the same id, email, or phone already exists in this project."
          )
          return false
        case "user_email_already_exists":
          toast.error("A user with the same email already exists.")
          return false
        case "user_phone_already_exists":
          toast.error("A user with the same phone number already exists.")
          return false
        case "team_invite_already_exists":
          toast.error(
            "User has already been invited or is already a member of this team."
          )
          return false
        case "team_already_exists":
          toast.error(
            "Team with requested ID already exists. Please choose a different ID and try again."
          )
          return false
        case "membership_already_confirmed":
          toast.error("Membership is already confirmed.")
          return false
        case "user_password_reset_required":
          toast.error("The current user requires a password reset.")
          return false
        case "user_oauth2_provider_error":
          toast.error(
            "An error occurred while communicating with the OAuth2 provider."
          )
          return false
        case "user_count_exceeded":
          toast.error(
            "The current project has exceeded the maximum number of users."
          )
          return false
        case "user_auth_method_unsupported":
          toast.error(
            "The requested authentication method is either disabled or unsupported."
          )
          return false
        default:
          console.error(response)
          toast.info("It seems that an error occurred")
          return false
      }
    default:
      toast.error("Invalid toast handler category provided.")
      return false
  }
}
