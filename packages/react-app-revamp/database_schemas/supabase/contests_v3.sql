create table
  public.contests_v3 (
    created_at timestamp with time zone null default now(),
    start_at timestamp with time zone null,
    end_at timestamp with time zone null,
    address character varying null,
    author_address character varying null,
    network_name character varying null,
    vote_start_at timestamp with time zone null,
    featured boolean null,
    title character varying null,
    type character varying null,
    prompt character varying null,
    uuid uuid not null default gen_random_uuid (),
    "votingMerkleRoot" character varying null,
    "submissionMerkleRoot" character varying null,
    voting_requirements json null,
    submission_requirements json null,
    cost_to_propose numeric null,
    percentage_to_creator numeric null,
    cost_to_vote numeric null,
    has_been_featured boolean null default false,
    constraint contests_v3_pkey primary key (uuid)
  ) tablespace pg_default;

create index if not exists idx_contests_v3_title on public.contests_v3 using btree (title) tablespace pg_default;

create index if not exists idx_contests_v3_featured on public.contests_v3 using btree (featured) tablespace pg_default;

create index if not exists idx_contests_v3_address on public.contests_v3 using btree (address) tablespace pg_default;

create index if not exists idx_contests_v3_author_address on public.contests_v3 using btree (author_address) tablespace pg_default;
