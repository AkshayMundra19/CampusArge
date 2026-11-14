<?php
/**
 * logAdminAction — writes one row to admin_audit_log.
 *
 * @param PDO         $pdo         Active database connection
 * @param string      $actorId     UUID of the admin performing the action
 * @param string      $action      Short description, e.g. 'approve_faculty', 'suspend_user'
 * @param string      $targetTable Table that was affected, e.g. 'faculty', 'users'
 * @param string      $targetId    UUID/PK of the affected row
 * @param array|null  $before      Snapshot of the row BEFORE the change (null for creates/approvals)
 * @param array|null  $after       Snapshot of the row AFTER the change (null for deletes)
 */
function logAdminAction(PDO $pdo, string $actorId, string $action, string $targetTable, string $targetId, ?array $before = null, ?array $after = null): void {
    try {
        $logId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff),
            mt_rand(0,0x0fff)|0x4000, mt_rand(0,0x3fff)|0x8000,
            mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff));
        $stmt = $pdo->prepare(
            "INSERT INTO admin_audit_log (id, actor_id, action, target_table, target_id, before_data, after_data, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
        );
        $stmt->execute([
            $logId,
            $actorId,
            $action,
            $targetTable,
            $targetId,
            $before !== null ? json_encode($before) : null,
            $after  !== null ? json_encode($after)  : null,
        ]);
    } catch (Exception $e) {
        // Audit failures must not break the main operation — log silently
        error_log("audit_log failed: " . $e->getMessage());
    }
}
