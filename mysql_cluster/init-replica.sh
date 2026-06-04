#!/bin/bash
set -e

echo "Waiting for mysql-primary to be ready..."
until mysql -h "mysql-primary" -u "repl_user" -p"password" -e "SELECT 1;" &>/dev/null; do
  sleep 2
done

echo "mysql-primary is online. Configuring replication..."

mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='mysql-primary',
  SOURCE_PORT=3306,
  SOURCE_USER='repl_user',
  SOURCE_PASSWORD='password',
  SOURCE_AUTO_POSITION=1,
  GET_SOURCE_PUBLIC_KEY=1;

START REPLICA;
EOF

echo "Replication automated successfully!"
