export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          notes: string;
          deadline: string;
          column_type: 'today' | 'this_week' | 'later' | 'done';
          created_at: string;
          completed_at: string | null;
          is_weekend_task: boolean;
          delegated_to: string | null;
          reminder_frequency: 'hourly' | 'few_hours' | 'twice_daily';
          last_reminded_at: string | null;
          escalation_level: number;
          tags: Json;
          updated_at: string;
          recurrence_pattern: 'daily' | 'weekly' | 'monthly' | null;
          recurrence_end_date: string | null;
          recurrence_day_of_week: number | null;
          recurrence_day_of_month: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          notes?: string;
          deadline: string;
          column_type?: 'today' | 'this_week' | 'later' | 'done';
          created_at?: string;
          completed_at?: string | null;
          is_weekend_task?: boolean;
          delegated_to?: string | null;
          reminder_frequency?: 'hourly' | 'few_hours' | 'twice_daily';
          last_reminded_at?: string | null;
          escalation_level?: number;
          tags?: Json;
          updated_at?: string;
          recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | null;
          recurrence_end_date?: string | null;
          recurrence_day_of_week?: number | null;
          recurrence_day_of_month?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          notes?: string;
          deadline?: string;
          column_type?: 'today' | 'this_week' | 'later' | 'done';
          created_at?: string;
          completed_at?: string | null;
          is_weekend_task?: boolean;
          delegated_to?: string | null;
          reminder_frequency?: 'hourly' | 'few_hours' | 'twice_daily';
          last_reminded_at?: string | null;
          escalation_level?: number;
          tags?: Json;
          updated_at?: string;
          recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | null;
          recurrence_end_date?: string | null;
          recurrence_day_of_week?: number | null;
          recurrence_day_of_month?: number | null;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          last_commitment_date: string | null;
          focus_mode_until: string | null;
          vacation_mode_until: string | null;
          committed_task_ids: string[];
          dismissed_stale_task_ids: string[];
          notification_preferences: Json;
          phone_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          last_commitment_date?: string | null;
          focus_mode_until?: string | null;
          vacation_mode_until?: string | null;
          committed_task_ids?: string[];
          dismissed_stale_task_ids?: string[];
          notification_preferences?: Json;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          last_commitment_date?: string | null;
          focus_mode_until?: string | null;
          vacation_mode_until?: string | null;
          committed_task_ids?: string[];
          dismissed_stale_task_ids?: string[];
          notification_preferences?: Json;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper type to convert database row to app Task type
export type DbTask = Database['public']['Tables']['tasks']['Row'];
export type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type DbTaskUpdate = Database['public']['Tables']['tasks']['Update'];
export type DbUserSettings = Database['public']['Tables']['user_settings']['Row'];
