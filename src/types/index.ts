export type JourneyType = 'QURAN' | 'YASEEN_40';
export type UnitStatus = 'UNASSIGNED' | 'ASSIGNED' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  is_guest: boolean;
  created_at: string;
}

export interface Journey {
  id: string;
  title: string;
  dedication_name: string;
  type: JourneyType;
  description: string | null;
  created_by: string;
  invite_code: string;
  is_active: boolean;
  is_complete: boolean;
  created_at: string;
}

export interface JourneyParticipant {
  user_id: string;
  journey_id: string;
  joined_at: string;
  is_admin: boolean;
  user?: User;
}

export interface JourneyUnit {
  id: string;
  journey_id: string;
  unit_number: number;
  assigned_to: string | null;
  status: UnitStatus;
  updated_at: string;
  assigned_user?: User | null;
}

// Enriched types used in the UI
export interface JourneyWithStats extends Journey {
  participant_count: number;
  completed_count: number;
  total_units: number;
  creator?: User;
}

export interface JourneyDetail extends Journey {
  units: JourneyUnit[];
  participants: JourneyParticipant[];
  creator: User;
  participant_count: number;
  completed_count: number;
  total_units: number;
  current_user_is_admin?: boolean;
  current_user_is_participant?: boolean;
}
