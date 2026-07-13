import type { MemberRole, MemberStatus } from "~/data/seed";

import * as m from "~/i18n/messages";

// `role` and `status` are storage values, not display text. Rendering them raw
// left English words in an otherwise fully Arabic page, and relied on a CSS
// `capitalize` to look presentable -- which does nothing for a non-Latin script.
const ROLE_LABELS: Record<MemberRole, () => string> = {
  owner: m.memberRoleOwner,
  admin: m.memberRoleAdmin,
  member: m.memberRoleMember,
  viewer: m.memberRoleViewer,
};

const STATUS_LABELS: Record<MemberStatus, () => string> = {
  active: m.memberStatusActive,
  invited: m.memberStatusInvited,
  suspended: m.memberStatusSuspended,
};

export function roleLabel(role: MemberRole): string {
  return ROLE_LABELS[role]();
}

export function statusLabel(status: MemberStatus): string {
  return STATUS_LABELS[status]();
}
