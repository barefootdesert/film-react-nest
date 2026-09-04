DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
    id uuid PRIMARY KEY,
    rating double precision NOT NULL,
    director varchar NOT NULL,
    tags text NOT NULL,
    image varchar NOT NULL,
    cover varchar NOT NULL,
    title varchar NOT NULL,
    about varchar NOT NULL,
    description varchar NOT NULL
);

CREATE TABLE schedules (
    id uuid PRIMARY KEY,
    daytime varchar NOT NULL,
    hall integer NOT NULL,
    rows integer NOT NULL,
    seats integer NOT NULL,
    price double precision NOT NULL,
    taken text NOT NULL,
    "filmId" uuid REFERENCES films(id) ON DELETE CASCADE
);
