'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS demo (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `).then(() => {
    return db.runSql(`
      INSERT INTO demo (title, description) 
      VALUES ('Demo Item 1', 'This is a demo record from PostgreSQL database')
    `);
  });
};

exports.down = function(db) {
  return db.runSql('DROP TABLE IF EXISTS demo');
};

exports._meta = {
  "version": 1
};
