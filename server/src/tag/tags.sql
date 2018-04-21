create table tags (
  id uuid default uuid_generate_v4(),
  name varying character() NOT NULL,
  CONSTRAINT tags_id PRIMARY KEY (id)
);

create table items_tags (
  item_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT items_tags_id PRIMARY KEY (tag_id, user_id),
  CONSTRAINT tag_id_foreign_key FOREIGN KEY (tag_id) REFERENCES tag (id),
  CONSTRAINT item_id_foreign_key FOREIGN KEY (item_id) REFERENCES item (id),
);
