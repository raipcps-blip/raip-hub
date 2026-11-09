
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "audit_logs": {
                  Row: {
                    "action": string,"actor_id": string | null,"after_data": Json | null,"before_data": Json | null,"created_at": string,"entity_id": string | null,"entity_type": string,"id": number,"reason": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"after_data"?: Json | null,"before_data"?: Json | null,"created_at"?: string,"entity_id"?: string | null,"entity_type": string,"id"?: never,"reason"?: string | null
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"after_data"?: Json | null,"before_data"?: Json | null,"created_at"?: string,"entity_id"?: string | null,"entity_type"?: string,"id"?: never,"reason"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_logs_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"companies": {
                  Row: {
                    "archived_at": string | null,"city": string | null,"company_size": string | null,"created_at": string,"created_by": string,"email": string | null,"employee_count": number | null,"estimated_revenue_cents": number | null,"id": string,"legal_name": string | null,"notes": string | null,"origin": string | null,"owner_id": string | null,"phone": string | null,"segment": string | null,"state": string | null,"tax_id": string | null,"tax_id_normalized": string | null,"trade_name": string,"updated_at": string,"updated_by": string | null,"website": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "archived_at"?: string | null,"city"?: string | null,"company_size"?: string | null,"created_at"?: string,"created_by": string,"email"?: string | null,"employee_count"?: number | null,"estimated_revenue_cents"?: number | null,"id"?: string,"legal_name"?: string | null,"notes"?: string | null,"origin"?: string | null,"owner_id"?: string | null,"phone"?: string | null,"segment"?: string | null,"state"?: string | null,"tax_id"?: string | null,"tax_id_normalized"?: never,"trade_name": string,"updated_at"?: string,"updated_by"?: string | null,"website"?: string | null
                  }
                  Update: {
                    "archived_at"?: string | null,"city"?: string | null,"company_size"?: string | null,"created_at"?: string,"created_by"?: string,"email"?: string | null,"employee_count"?: number | null,"estimated_revenue_cents"?: number | null,"id"?: string,"legal_name"?: string | null,"notes"?: string | null,"origin"?: string | null,"owner_id"?: string | null,"phone"?: string | null,"segment"?: string | null,"state"?: string | null,"tax_id"?: string | null,"tax_id_normalized"?: never,"trade_name"?: string,"updated_at"?: string,"updated_by"?: string | null,"website"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "companies_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "companies_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "companies_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"company_settings": {
                  Row: {
                    "address": NonNullable<Json>,"email": string | null,"legal_name": string | null,"phone": string | null,"singleton": boolean,"tax_id": string | null,"trade_name": string,"updated_at": string,"updated_by": string | null,"website": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: NonNullable<Json>,"email"?: string | null,"legal_name"?: string | null,"phone"?: string | null,"singleton"?: boolean,"tax_id"?: string | null,"trade_name"?: string,"updated_at"?: string,"updated_by"?: string | null,"website"?: string | null
                  }
                  Update: {
                    "address"?: NonNullable<Json>,"email"?: string | null,"legal_name"?: string | null,"phone"?: string | null,"singleton"?: boolean,"tax_id"?: string | null,"trade_name"?: string,"updated_at"?: string,"updated_by"?: string | null,"website"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "company_settings_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"contacts": {
                  Row: {
                    "archived_at": string | null,"company_id": string,"created_at": string,"created_by": string,"email": string | null,"full_name": string,"id": string,"is_primary": boolean,"notes": string | null,"phone": string | null,"role_title": string | null,"updated_at": string,"updated_by": string | null,"whatsapp": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "archived_at"?: string | null,"company_id": string,"created_at"?: string,"created_by": string,"email"?: string | null,"full_name": string,"id"?: string,"is_primary"?: boolean,"notes"?: string | null,"phone"?: string | null,"role_title"?: string | null,"updated_at"?: string,"updated_by"?: string | null,"whatsapp"?: string | null
                  }
                  Update: {
                    "archived_at"?: string | null,"company_id"?: string,"created_at"?: string,"created_by"?: string,"email"?: string | null,"full_name"?: string,"id"?: string,"is_primary"?: boolean,"notes"?: string | null,"phone"?: string | null,"role_title"?: string | null,"updated_at"?: string,"updated_by"?: string | null,"whatsapp"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "contacts_company_id_fkey"
      columns: ["company_id"]
isOneToOne: false
      referencedRelation: "companies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "contacts_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "contacts_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"document_sequences": {
                  Row: {
                    "last_value": number,"prefix": string,"year": number
                  }
                  ComputedFields: never
                  Insert: {
                    "last_value"?: number,"prefix": string,"year": number
                  }
                  Update: {
                    "last_value"?: number,"prefix"?: string,"year"?: number
                  }
                  Relationships: [
                    
                  ]
                },"financial_accounts": {
                  Row: {
                    "account_type": string,"active": boolean,"created_at": string,"created_by": string,"id": string,"initial_balance_cents": number,"name": string,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "account_type": string,"active"?: boolean,"created_at"?: string,"created_by": string,"id"?: string,"initial_balance_cents"?: number,"name": string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "account_type"?: string,"active"?: boolean,"created_at"?: string,"created_by"?: string,"id"?: string,"initial_balance_cents"?: number,"name"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "financial_accounts_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "financial_accounts_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"financial_transactions": {
                  Row: {
                    "account_id": string,"amount_cents": number,"created_at": string,"created_by": string,"description": string,"id": string,"receivable_id": string | null,"reversal_of_id": string | null,"transaction_date": string,"transaction_type": Database["public"]['Enums']["transaction_type"]
                  }
                  ComputedFields: never
                  Insert: {
                    "account_id": string,"amount_cents": number,"created_at"?: string,"created_by": string,"description": string,"id"?: string,"receivable_id"?: string | null,"reversal_of_id"?: string | null,"transaction_date": string,"transaction_type": Database["public"]['Enums']["transaction_type"]
                  }
                  Update: {
                    "account_id"?: string,"amount_cents"?: number,"created_at"?: string,"created_by"?: string,"description"?: string,"id"?: string,"receivable_id"?: string | null,"reversal_of_id"?: string | null,"transaction_date"?: string,"transaction_type"?: Database["public"]['Enums']["transaction_type"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "financial_transactions_account_id_fkey"
      columns: ["account_id"]
isOneToOne: false
      referencedRelation: "financial_accounts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "financial_transactions_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "financial_transactions_receivable_id_fkey"
      columns: ["receivable_id"]
isOneToOne: false
      referencedRelation: "receivables"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "financial_transactions_reversal_of_id_fkey"
      columns: ["reversal_of_id"]
isOneToOne: true
      referencedRelation: "financial_transactions"
      referencedColumns: ["id"]
    }
                  ]
                },"opportunities": {
                  Row: {
                    "archived_at": string | null,"closed_at": string | null,"company_id": string,"created_at": string,"created_by": string,"estimated_value_cents": number | null,"id": string,"loss_reason": string | null,"next_action": string | null,"next_action_at": string | null,"owner_id": string,"primary_contact_id": string | null,"probability": number | null,"service_line": Database["public"]['Enums']["service_line"],"source": string | null,"stage": Database["public"]['Enums']["opportunity_stage"],"title": string,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "archived_at"?: string | null,"closed_at"?: string | null,"company_id": string,"created_at"?: string,"created_by": string,"estimated_value_cents"?: number | null,"id"?: string,"loss_reason"?: string | null,"next_action"?: string | null,"next_action_at"?: string | null,"owner_id": string,"primary_contact_id"?: string | null,"probability"?: number | null,"service_line": Database["public"]['Enums']["service_line"],"source"?: string | null,"stage"?: Database["public"]['Enums']["opportunity_stage"],"title": string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "archived_at"?: string | null,"closed_at"?: string | null,"company_id"?: string,"created_at"?: string,"created_by"?: string,"estimated_value_cents"?: number | null,"id"?: string,"loss_reason"?: string | null,"next_action"?: string | null,"next_action_at"?: string | null,"owner_id"?: string,"primary_contact_id"?: string | null,"probability"?: number | null,"service_line"?: Database["public"]['Enums']["service_line"],"source"?: string | null,"stage"?: Database["public"]['Enums']["opportunity_stage"],"title"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "opportunities_company_id_fkey"
      columns: ["company_id"]
isOneToOne: false
      referencedRelation: "companies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "opportunities_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "opportunities_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "opportunities_primary_contact_id_fkey"
      columns: ["primary_contact_id"]
isOneToOne: false
      referencedRelation: "contacts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "opportunities_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"opportunity_activities": {
                  Row: {
                    "activity_type": string,"completed_at": string | null,"created_at": string,"created_by": string,"due_at": string | null,"id": string,"notes": string | null,"opportunity_id": string,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "activity_type": string,"completed_at"?: string | null,"created_at"?: string,"created_by": string,"due_at"?: string | null,"id"?: string,"notes"?: string | null,"opportunity_id": string,"title": string
                  }
                  Update: {
                    "activity_type"?: string,"completed_at"?: string | null,"created_at"?: string,"created_by"?: string,"due_at"?: string | null,"id"?: string,"notes"?: string | null,"opportunity_id"?: string,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "opportunity_activities_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "opportunity_activities_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    }
                  ]
                },"permissions": {
                  Row: {
                    "code": string,"created_at": string,"description": string,"id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"created_at"?: string,"description": string,"id"?: string
                  }
                  Update: {
                    "code"?: string,"created_at"?: string,"description"?: string,"id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profile_roles": {
                  Row: {
                    "assigned_at": string,"assigned_by": string | null,"profile_id": string,"role_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "assigned_at"?: string,"assigned_by"?: string | null,"profile_id": string,"role_id": string
                  }
                  Update: {
                    "assigned_at"?: string,"assigned_by"?: string | null,"profile_id"?: string,"role_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profile_roles_assigned_by_fkey"
      columns: ["assigned_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profile_roles_profile_id_fkey"
      columns: ["profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profile_roles_role_id_fkey"
      columns: ["role_id"]
isOneToOne: false
      referencedRelation: "roles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "active": boolean,"created_at": string,"full_name": string | null,"id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"full_name"?: string | null,"id": string,"updated_at"?: string
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"full_name"?: string | null,"id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"projects": {
                  Row: {
                    "actual_end": string | null,"actual_start": string | null,"company_id": string,"created_at": string,"created_by": string | null,"id": string,"internal_notes": string | null,"number": string,"opportunity_id": string,"owner_id": string | null,"planned_end": string | null,"planned_start": string | null,"primary_service_line": Database["public"]['Enums']["service_line"],"proposal_id": string,"proposal_version_id": string,"status": Database["public"]['Enums']["project_status"],"title": string,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "actual_end"?: string | null,"actual_start"?: string | null,"company_id": string,"created_at"?: string,"created_by"?: string | null,"id"?: string,"internal_notes"?: string | null,"number": string,"opportunity_id": string,"owner_id"?: string | null,"planned_end"?: string | null,"planned_start"?: string | null,"primary_service_line": Database["public"]['Enums']["service_line"],"proposal_id": string,"proposal_version_id": string,"status"?: Database["public"]['Enums']["project_status"],"title": string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "actual_end"?: string | null,"actual_start"?: string | null,"company_id"?: string,"created_at"?: string,"created_by"?: string | null,"id"?: string,"internal_notes"?: string | null,"number"?: string,"opportunity_id"?: string,"owner_id"?: string | null,"planned_end"?: string | null,"planned_start"?: string | null,"primary_service_line"?: Database["public"]['Enums']["service_line"],"proposal_id"?: string,"proposal_version_id"?: string,"status"?: Database["public"]['Enums']["project_status"],"title"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "projects_company_id_fkey"
      columns: ["company_id"]
isOneToOne: false
      referencedRelation: "companies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "projects_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "projects_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "projects_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "projects_proposal_id_fkey"
      columns: ["proposal_id"]
isOneToOne: true
      referencedRelation: "proposals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "projects_proposal_version_id_fkey"
      columns: ["proposal_version_id"]
isOneToOne: false
      referencedRelation: "proposal_versions"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "projects_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"proposal_items": {
                  Row: {
                    "description": string,"id": string,"notes": string | null,"position": number,"proposal_id": string,"quantity": number,"service_id": string | null,"service_line": Database["public"]['Enums']["service_line"],"total_cents": number,"unit": string,"unit_price_cents": number
                  }
                  ComputedFields: never
                  Insert: {
                    "description": string,"id"?: string,"notes"?: string | null,"position": number,"proposal_id": string,"quantity": number,"service_id"?: string | null,"service_line": Database["public"]['Enums']["service_line"],"total_cents": number,"unit": string,"unit_price_cents": number
                  }
                  Update: {
                    "description"?: string,"id"?: string,"notes"?: string | null,"position"?: number,"proposal_id"?: string,"quantity"?: number,"service_id"?: string | null,"service_line"?: Database["public"]['Enums']["service_line"],"total_cents"?: number,"unit"?: string,"unit_price_cents"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "proposal_items_proposal_id_fkey"
      columns: ["proposal_id"]
isOneToOne: false
      referencedRelation: "proposals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposal_items_service_id_fkey"
      columns: ["service_id"]
isOneToOne: false
      referencedRelation: "services"
      referencedColumns: ["id"]
    }
                  ]
                },"proposal_payment_terms": {
                  Row: {
                    "amount_cents": number,"days_after_approval": number | null,"description": string | null,"due_date": string | null,"id": string,"proposal_id": string,"sequence": number
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents": number,"days_after_approval"?: number | null,"description"?: string | null,"due_date"?: string | null,"id"?: string,"proposal_id": string,"sequence": number
                  }
                  Update: {
                    "amount_cents"?: number,"days_after_approval"?: number | null,"description"?: string | null,"due_date"?: string | null,"id"?: string,"proposal_id"?: string,"sequence"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "proposal_payment_terms_proposal_id_fkey"
      columns: ["proposal_id"]
isOneToOne: false
      referencedRelation: "proposals"
      referencedColumns: ["id"]
    }
                  ]
                },"proposal_versions": {
                  Row: {
                    "created_at": string,"created_by": string | null,"generated_for_status": Database["public"]['Enums']["proposal_status"],"id": string,"proposal_id": string,"snapshot": NonNullable<Json>,"version": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"generated_for_status": Database["public"]['Enums']["proposal_status"],"id"?: string,"proposal_id": string,"snapshot": NonNullable<Json>,"version": number
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"generated_for_status"?: Database["public"]['Enums']["proposal_status"],"id"?: string,"proposal_id"?: string,"snapshot"?: NonNullable<Json>,"version"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "proposal_versions_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposal_versions_proposal_id_fkey"
      columns: ["proposal_id"]
isOneToOne: false
      referencedRelation: "proposals"
      referencedColumns: ["id"]
    }
                  ]
                },"proposals": {
                  Row: {
                    "approved_at": string | null,"archived_at": string | null,"commercial_notes": string | null,"company_id": string,"created_at": string,"created_by": string,"discount_cents": number,"id": string,"issue_date": string,"number": string,"opportunity_id": string,"owner_id": string,"primary_contact_id": string | null,"scope": string | null,"status": Database["public"]['Enums']["proposal_status"],"subtotal_cents": number,"title": string,"total_cents": number,"updated_at": string,"updated_by": string | null,"valid_until": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "approved_at"?: string | null,"archived_at"?: string | null,"commercial_notes"?: string | null,"company_id": string,"created_at"?: string,"created_by": string,"discount_cents"?: number,"id"?: string,"issue_date"?: string,"number": string,"opportunity_id": string,"owner_id": string,"primary_contact_id"?: string | null,"scope"?: string | null,"status"?: Database["public"]['Enums']["proposal_status"],"subtotal_cents"?: number,"title": string,"total_cents"?: number,"updated_at"?: string,"updated_by"?: string | null,"valid_until"?: string | null
                  }
                  Update: {
                    "approved_at"?: string | null,"archived_at"?: string | null,"commercial_notes"?: string | null,"company_id"?: string,"created_at"?: string,"created_by"?: string,"discount_cents"?: number,"id"?: string,"issue_date"?: string,"number"?: string,"opportunity_id"?: string,"owner_id"?: string,"primary_contact_id"?: string | null,"scope"?: string | null,"status"?: Database["public"]['Enums']["proposal_status"],"subtotal_cents"?: number,"title"?: string,"total_cents"?: number,"updated_at"?: string,"updated_by"?: string | null,"valid_until"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "proposals_company_id_fkey"
      columns: ["company_id"]
isOneToOne: false
      referencedRelation: "companies"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposals_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposals_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposals_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposals_primary_contact_id_fkey"
      columns: ["primary_contact_id"]
isOneToOne: false
      referencedRelation: "contacts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "proposals_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"receivables": {
                  Row: {
                    "amount_cents": number,"cancellation_reason": string | null,"cancelled_at": string | null,"created_at": string,"created_by": string | null,"description": string | null,"due_date": string,"id": string,"project_id": string,"proposal_payment_term_id": string | null,"received_at": string | null,"sequence": number,"status": Database["public"]['Enums']["receivable_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents": number,"cancellation_reason"?: string | null,"cancelled_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"description"?: string | null,"due_date": string,"id"?: string,"project_id": string,"proposal_payment_term_id"?: string | null,"received_at"?: string | null,"sequence": number,"status"?: Database["public"]['Enums']["receivable_status"]
                  }
                  Update: {
                    "amount_cents"?: number,"cancellation_reason"?: string | null,"cancelled_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"description"?: string | null,"due_date"?: string,"id"?: string,"project_id"?: string,"proposal_payment_term_id"?: string | null,"received_at"?: string | null,"sequence"?: number,"status"?: Database["public"]['Enums']["receivable_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "receivables_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "receivables_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "projects"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "receivables_proposal_payment_term_id_fkey"
      columns: ["proposal_payment_term_id"]
isOneToOne: false
      referencedRelation: "proposal_payment_terms"
      referencedColumns: ["id"]
    }
                  ]
                },"role_permissions": {
                  Row: {
                    "permission_id": string,"role_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "permission_id": string,"role_id": string
                  }
                  Update: {
                    "permission_id"?: string,"role_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "role_permissions_permission_id_fkey"
      columns: ["permission_id"]
isOneToOne: false
      referencedRelation: "permissions"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "role_permissions_role_id_fkey"
      columns: ["role_id"]
isOneToOne: false
      referencedRelation: "roles"
      referencedColumns: ["id"]
    }
                  ]
                },"roles": {
                  Row: {
                    "code": string,"created_at": string,"id": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"created_at"?: string,"id"?: string,"name": string
                  }
                  Update: {
                    "code"?: string,"created_at"?: string,"id"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"services": {
                  Row: {
                    "active": boolean,"billing_unit": string,"created_at": string,"created_by": string,"description": string | null,"id": string,"name": string,"service_line": Database["public"]['Enums']["service_line"],"suggested_price_cents": number | null,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"billing_unit": string,"created_at"?: string,"created_by": string,"description"?: string | null,"id"?: string,"name": string,"service_line": Database["public"]['Enums']["service_line"],"suggested_price_cents"?: number | null,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "active"?: boolean,"billing_unit"?: string,"created_at"?: string,"created_by"?: string,"description"?: string | null,"id"?: string,"name"?: string,"service_line"?: Database["public"]['Enums']["service_line"],"suggested_price_cents"?: number | null,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "services_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "services_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "approve_proposal":
{ Args: { "p_proposal_id": string }; Returns: string
                           },
"has_permission":
{ Args: { "p_permission": string }; Returns: boolean
                           },
"next_document_number":
{ Args: { "p_prefix": string }; Returns: string
                           },
"show_limit":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"show_trgm":
{ Args: { "": string }; Returns: (string)[]
                           },
"write_audit_log":
{ Args: { "p_action": string,"p_after"?: Json,"p_before"?: Json,"p_entity_id": string,"p_entity_type": string,"p_reason"?: string }; Returns: undefined
                           }
          }
          Enums: {
            "opportunity_stage": "NOVO_LEAD"|"CONTATO_REALIZADO"|"DIAGNOSTICO"|"PROPOSTA_PREPARACAO"|"PROPOSTA_ENVIADA"|"NEGOCIACAO"|"GANHO"|"PERDIDO","project_status": "NAO_INICIADO"|"EM_ANDAMENTO"|"AGUARDANDO_CLIENTE"|"CONCLUIDO"|"CANCELADO","proposal_status": "RASCUNHO"|"ENVIADA"|"EM_NEGOCIACAO"|"APROVADA"|"RECUSADA"|"EXPIRADA"|"CANCELADA","receivable_status": "PENDENTE"|"RECEBIDO"|"CANCELADO","service_line": "ESTRUTURA_COMERCIAL_CRM"|"MICROSSISTEMAS_SOB_MEDIDA"|"MARCA_COMUNICACAO"|"CRESCIMENTO_DIGITAL","transaction_type": "ENTRADA"|"SAIDA"|"ESTORNO"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "opportunity_stage": ["NOVO_LEAD", "CONTATO_REALIZADO", "DIAGNOSTICO", "PROPOSTA_PREPARACAO", "PROPOSTA_ENVIADA", "NEGOCIACAO", "GANHO", "PERDIDO"],"project_status": ["NAO_INICIADO", "EM_ANDAMENTO", "AGUARDANDO_CLIENTE", "CONCLUIDO", "CANCELADO"],"proposal_status": ["RASCUNHO", "ENVIADA", "EM_NEGOCIACAO", "APROVADA", "RECUSADA", "EXPIRADA", "CANCELADA"],"receivable_status": ["PENDENTE", "RECEBIDO", "CANCELADO"],"service_line": ["ESTRUTURA_COMERCIAL_CRM", "MICROSSISTEMAS_SOB_MEDIDA", "MARCA_COMUNICACAO", "CRESCIMENTO_DIGITAL"],"transaction_type": ["ENTRADA", "SAIDA", "ESTORNO"]
          }
        }
} as const
