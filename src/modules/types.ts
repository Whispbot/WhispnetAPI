export type User = {
  id: string | undefined;
  username: string | undefined;
  avatar: string | undefined;
  discriminator: string | undefined;
  public_flags: number | undefined;
  flags: number | undefined;
  banner: string | undefined;
  accent_color: number | undefined;
  global_name: string | undefined;
  banner_color: string | undefined;
  clan: string | undefined;
  mfa_enabled: boolean | undefined;
  locale: string | undefined;
  premium_type: number | undefined;
};

export type UserGuild = {
  id: string | undefined;
  name: string | undefined;
  icon: string | undefined;
  banner: string | undefined;
  owner: boolean | undefined;
  permissions: number | undefined;
  permissions_new: string | undefined;
  feature: string[] | undefined;
  vanity?: string;
};

export type Job = {
  jobid: string;
  type: number;
  next_update: number;
  duration: number;
  erlc_command?: string;
};

export type RobloxModerationType = {
  typeid?: string;
  name?: string;
  channel?: string;
  admin_channel?: string;
  allowed_roles?: string[];
};

export type PermissionRole = {
  roleid?: string;
  name?: string;
  roles?: string[];
  permissions?: number;
};

export type ShiftType = {
  typeid?: string;
  name?: string;
  role?: string;
  log_channel?: string;
  allowed_roles: string[];
};

export type AuditLog = {
  timestamp: number;
  userid: string;
  username: string;
  useravatar: string;
  description: string;
  action: string;
};

export type CADData = {
  name: string;
  departments?: CADDepartment[];
};

export type CADDepartment = {
  name: string;
  url: string;
  guild_id?: string;
  required_roles?: string;
};

export enum CADDepartmentIcon {
  none = 0,
  leo = 1
}

export enum CADDepartmentType {
  law_enforcement = 0,
  civilian = 1,
  record_management = 2,
  public_services = 3,
  civilian_services = 4
}

export type GuildConfig = {
  _id: string;
  vanity?: string;
  prefix?: string;
  blacklist?: {
    active: boolean;
    reason: string;
    ends: number;
  };
  premiumUntil?: number;

  cad?: CADData;

  modlog_channel: string;
  current_moderation_case: number;
  moderations_display_case: boolean;
  moderations_display_reason: boolean;
  moderations_delete_message: boolean;
  moderations_default_length_mute: number;
  moderations_default_length_ban: number;
  moderations_ban_delete_messages: number;
  moderations_presets: { [id: string]: string };

  enabled_modules?: number[];
  permission_roles?: PermissionRole[];
  audit_logs?: AuditLog[];

  shift_types: ShiftType[];

  default_roblox_moderation_channel?: string;
  default_roblox_moderation_admin_channel?: string;
  roblox_banrequest_channel?: string;
  roblox_banrequest_admin_channel?: string;
  roblox_moderation_types?: RobloxModerationType[];

  // ---------- Jobs ---------- //
  jobs?: Job[];

  // ---------- PRC --------- //
  prc_api_key?: string;

  ingame_members?: number;
  last_updated_serverinfo?: number;

  joinlog_channel?: string;
  last_updated_joinlogs?: number;
  last_updated_joinlogs_channel?: number;

  killlog_channel?: string;
  last_updated_killlogs?: number;
  last_updated_killlogs_channel?: number;

  modcall_channel?: string;
  last_updated_modcalls?: number;
  last_updated_modcalls_channel?: number;

  erlc_command_log_webhook?: string;
  erlc_moderation_log_webhook?: string;
  kick_moderation_type?: string;
  ban_moderation_type?: string;
  send_erlc_feedback?: boolean;

  // ---------- Bloxlink ---------- //
  bloxlink_api_key?: string;
};

export type UserCookie = {
  id: string;
  cookie: string;
  cookieEnds: number;
  username: string;
  avatar: string;
  access: string;
  accessEnds: number;
  type: string;
  refresh: string;
};

export type Role = {
  id: string;
  name: string;
  color?: number;
  hoist?: boolean;
  icon?: string;
  unicode_emoji?: string;
  position: number;
  permissions?: string;
  managed?: boolean;
  mentionable?: boolean;
  flags?: number;
};

export type Emoji = {};

export type Sticker = {};

export type WelcomeScreen = {};

export type Member = {
  user?: User;
  nick?: string;
  avatar?: string;
  banner?: string;
  roles: string[];
  joined_at: string;
  premium_since?: string;
  deaf: boolean;
  mute: boolean;
  flags: number;
  pending?: boolean;
  permissions?: string;
  communication_disabled_until?: string;
  avatar_decoration_data?: null;
};

export type Guild = {
  id: string;
  name: string;
  icon: string;
  icon_hash?: string;
  splash?: string;
  discovery_splash?: string;
  owner?: boolean;
  owner_id: string;
  permissions?: string;
  region?: string;
  afk_channel_id?: string;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: string;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: Role[];
  emojis: Emoji[];
  features: string[];
  mfa_level: number;
  application_id?: string;
  system_channel_id?: string;
  system_channel_flags: number;
  rules_channel_id?: string;
  max_presences?: number;
  max_members?: number;
  vanity_url_code?: string;
  description?: string;
  banner?: string;
  premium_tier?: number;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id?: string;
  max_video_channel_users?: number;
  max_stage_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: WelcomeScreen;
  nsfw_level: number;
  stickers?: Sticker[];
  premium_progress_bar_enabled: boolean;
  safety_alerts_channel_id: string;
  channels?: Channel[];
  webhooks?: Webhook[];
};

export type Webhook = {
  id: string;
  type: WebhookType;
  guild_id?: string;
  channel_id?: string;
  user?: User;
  name?: string;
  avatar?: string;
  token?: string;
  application_id?: string;
  source_guild?: Guild;
  source_channel?: Channel;
  url?: string;
};

export enum WebhookType {
  INCOMING = 1,
  CHANNEL_FOLLOWER = 2,
  APPLICATION = 3
}

export type Channel = {
  id: string;
  name?: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: unknown;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: User[];
  icon?: string;
  owner_id?: string;
  application_id?: string;
  managed?: boolean;
  parent_id?: string;
  last_pin_timestamp?: string;
  rtc_region?: string;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  thread_metadata?: unknown;
  member?: Member;
  default_auto_archive_duration?: number;
  permissions?: string;
  flags?: number;
  total_message_sent?: number;
  available_tags?: unknown;
  applied_tags?: unknown;
  default_reaction_emoji?: Emoji;
  default_thread_rate_limit_per_user?: number;
  default_sort_order?: number;
  default_forum_layout?: number;
};

export type WebhookRequest = {
  version: number;
  application_id: string;
  type: WebhookType;
  event?: {
    type:
      | "APPLICATION_AUTHORIZED"
      | "ENTITLEMENT_CREATE"
      | "QUEST_USER_ENROLLMENT";
    timestamp: string;
    data: any;
  };
};

export enum WebhookType {
  PING = 0,
  Event = 1
}

export type APPLICATION_AUTHORIZED = {
  integration_type?: number;
  user: User;
  scopes: string[];
  guild: Guild;
};

export type Entitlement = {
  id: string;
  application_id: string;
  consumed?: boolean;
  deleted: boolean;
  gift_code_flags: 0;
  promotion_id?: string;
  sku_id: string;
  type: EntitlementType;
  user_id?: string;
  starts_at?: string;
  ends_at?: string;
  guild_id?: string;
};

export enum EntitlementType {
  PURCHASE = 1,
  PREMIUM_SUBSCRIPTION = 2,
  DEVELOPER_GIFT = 3,
  TEST_MODE_PURCHASE = 4,
  FREE_PURCHASE = 5,
  USER_GIFT = 6,
  PREMIUM_PURCHASE = 7,
  APPLICATION_SUBSCRIPTION = 8
}
