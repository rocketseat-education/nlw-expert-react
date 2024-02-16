-- create the "notes" table
create table notes (
  id integer primary key,
  note TEXT not null,
  date_created datetime default current_timestamp
);