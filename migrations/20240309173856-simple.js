var dbm;
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.runSql(`
  CREATE TABLE public.users(
    id                SERIAL PRIMARY KEY,
    email             VARCHAR(50) NOT NULL,
    password          VARCHAR(255) NOT NULL,
    first_name        VARCHAR(255) NOT NULL,
    last_name         VARCHAR(255) NOT NULL,
    middle_name       VARCHAR(50) DEFAULT NULL,
    phone             VARCHAR(50) NOT NULL,
    status            INTEGER DEFAULT 10,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE public.user_chats(
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL,
    interlocutor_id   INTEGER NOT NULL,
    room              uuid NOT NULL,
    status            INTEGER DEFAULT 10,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_chats_user_id FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_chats_interlocutor_id FOREIGN KEY (interlocutor_id) REFERENCES public.users (id) ON DELETE CASCADE
  );

  CREATE TABLE public.messages(
    id                SERIAL PRIMARY KEY,
    msg_from_id       INTEGER NOT NULL,
    msg_to_id         INTEGER NOT NULL,
    room              uuid NOT NULL,
    date              TIMESTAMP NOT NULL DEFAULT (NOW()),
    message           TEXT DEFAULT NULL,
    file_path         VARCHAR(255) DEFAULT NULL,
    status            INTEGER DEFAULT 10,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_msg_from_id FOREIGN KEY (msg_from_id) REFERENCES public.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_msg_to_id FOREIGN KEY (msg_to_id) REFERENCES public.users (id) ON DELETE CASCADE
  );
`, function (err) {
    if (err) return callback(err);
    callback();
  });
};

exports.down = function (db, callback) {
  db.runSql(`
        DROP TABLE IF EXISTS public.messages;
        DROP TABLE IF EXISTS public.user_chats;
        DROP TABLE IF EXISTS public.users;
          `, function (err) {
    if (err) return callback(err);
    callback();
  });
};

exports._meta = {
  "version": 1
};