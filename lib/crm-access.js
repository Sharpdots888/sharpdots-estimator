function createCrmAccess(rawIds = '') {
  const userIds = new Set(String(rawIds).split(',').map(value => value.trim()).filter(value => /^[1-9]\d*$/.test(value)));
  return {
    allowsSession(user) {
      return Boolean(user?.id && (user.isAdmin === true || userIds.has(String(user.id))));
    },
    allowsUser(portalUser, databaseUser) {
      return Boolean(databaseUser?.is_active && String(portalUser?.id) === String(databaseUser.id)
        && ((portalUser.isAdmin === true && databaseUser.is_admin === true) || userIds.has(String(databaseUser.id))));
    }
  };
}

module.exports = { createCrmAccess };
