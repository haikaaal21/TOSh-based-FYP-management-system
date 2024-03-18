--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)

-- Started on 2024-03-19 01:19:34 +08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16387)
-- Name: User; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."User" (
    userid integer NOT NULL,
    email character varying(255) NOT NULL,
    salt character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    dob date NOT NULL,
    matricnumber character varying(50) NOT NULL,
    institution character varying(255) NOT NULL,
    unsubmittedtasks integer DEFAULT 0 NOT NULL,
    profilepic character varying(255) DEFAULT './assets/defaultProfilePic.jpg'::character varying NOT NULL,
    isstaff boolean,
    isstudent boolean DEFAULT true NOT NULL
);


ALTER TABLE public."User" OWNER TO kale;

--
-- TOC entry 209 (class 1259 OID 16386)
-- Name: User_userid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."User_userid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_userid_seq" OWNER TO kale;

--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 209
-- Name: User_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."User_userid_seq" OWNED BY public."User".userid;


--
-- TOC entry 212 (class 1259 OID 16426)
-- Name: AcademicStaff; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."AcademicStaff" (
    userid integer DEFAULT nextval('public."User_userid_seq"'::regclass),
    staffid integer NOT NULL,
    iscoordinator boolean,
    issupervisor boolean
)
INHERITS (public."User");


ALTER TABLE public."AcademicStaff" OWNER TO kale;

--
-- TOC entry 211 (class 1259 OID 16425)
-- Name: AcademicStaff_staffid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."AcademicStaff_staffid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AcademicStaff_staffid_seq" OWNER TO kale;

--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 211
-- Name: AcademicStaff_staffid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."AcademicStaff_staffid_seq" OWNED BY public."AcademicStaff".staffid;


--
-- TOC entry 214 (class 1259 OID 16443)
-- Name: Student; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Student" (
    userid integer DEFAULT nextval('public."User_userid_seq"'::regclass),
    studentid integer NOT NULL,
    batchid character varying(25)
)
INHERITS (public."User");


ALTER TABLE public."Student" OWNER TO kale;

--
-- TOC entry 213 (class 1259 OID 16442)
-- Name: Student_studentid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."Student_studentid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Student_studentid_seq" OWNER TO kale;

--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 213
-- Name: Student_studentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Student_studentid_seq" OWNED BY public."Student".studentid;


--
-- TOC entry 216 (class 1259 OID 16490)
-- Name: university; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public.university (
    uniid integer NOT NULL,
    uniname character varying(255) NOT NULL,
    typeofuni character varying(255) NOT NULL
);


ALTER TABLE public.university OWNER TO kale;

--
-- TOC entry 215 (class 1259 OID 16489)
-- Name: university_uniid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public.university_uniid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.university_uniid_seq OWNER TO kale;

--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 215
-- Name: university_uniid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public.university_uniid_seq OWNED BY public.university.uniid;


--
-- TOC entry 3227 (class 2604 OID 16430)
-- Name: AcademicStaff unsubmittedtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN unsubmittedtasks SET DEFAULT 0;


--
-- TOC entry 3228 (class 2604 OID 16431)
-- Name: AcademicStaff profilepic; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN profilepic SET DEFAULT './assets/defaultProfilePic.jpg'::character varying;


--
-- TOC entry 3229 (class 2604 OID 16432)
-- Name: AcademicStaff staffid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN staffid SET DEFAULT nextval('public."AcademicStaff_staffid_seq"'::regclass);


--
-- TOC entry 3230 (class 2604 OID 16487)
-- Name: AcademicStaff isstudent; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN isstudent SET DEFAULT true;


--
-- TOC entry 3232 (class 2604 OID 16447)
-- Name: Student unsubmittedtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN unsubmittedtasks SET DEFAULT 0;


--
-- TOC entry 3233 (class 2604 OID 16448)
-- Name: Student profilepic; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN profilepic SET DEFAULT './assets/defaultProfilePic.jpg'::character varying;


--
-- TOC entry 3234 (class 2604 OID 16449)
-- Name: Student studentid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN studentid SET DEFAULT nextval('public."Student_studentid_seq"'::regclass);


--
-- TOC entry 3235 (class 2604 OID 16488)
-- Name: Student isstudent; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN isstudent SET DEFAULT true;


--
-- TOC entry 3222 (class 2604 OID 16390)
-- Name: User userid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User" ALTER COLUMN userid SET DEFAULT nextval('public."User_userid_seq"'::regclass);


--
-- TOC entry 3236 (class 2604 OID 16493)
-- Name: university uniid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public.university ALTER COLUMN uniid SET DEFAULT nextval('public.university_uniid_seq'::regclass);


--
-- TOC entry 3395 (class 0 OID 16426)
-- Dependencies: 212
-- Data for Name: AcademicStaff; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."AcademicStaff" (userid, email, salt, password, name, dob, matricnumber, institution, unsubmittedtasks, profilepic, staffid, iscoordinator, issupervisor, isstaff, isstudent) FROM stdin;
\.


--
-- TOC entry 3397 (class 0 OID 16443)
-- Dependencies: 214
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Student" (userid, email, salt, password, name, dob, matricnumber, institution, unsubmittedtasks, profilepic, studentid, batchid, isstaff, isstudent) FROM stdin;
\.


--
-- TOC entry 3393 (class 0 OID 16387)
-- Dependencies: 210
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."User" (userid, email, salt, password, name, dob, matricnumber, institution, unsubmittedtasks, profilepic, isstaff, isstudent) FROM stdin;
\.


--
-- TOC entry 3399 (class 0 OID 16490)
-- Dependencies: 216
-- Data for Name: university; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public.university (uniid, uniname, typeofuni) FROM stdin;
1	Universiti Utara Malaysia	Public
2	Universiti Malaya	Public
3	Universiti Teknologi Malaysia	Public
4	Universiti Sains Malaysia	Public
5	Universiti Kebangsaan Malaysia	Public
6	Universiti Putra Malaysia	Public
7	Universiti Islam Antarabangsa Malaysia	Public
8	Universiti Malaysia Sabah	Public
9	Universiti Malaysia Sarawak	Public
10	Universiti Teknologi MARA	Public
11	Universiti Kuala Lumpur	Public
12	Universiti Tun Hussein Onn Malaysia	Public
13	Universiti Teknikal Malaysia Melaka	Public
14	Universiti Malaysia Pahang	Public
15	Universiti Malaysia Perlis	Public
16	Universiti Sultan Zainal Abidin	Public
17	Universiti Malaysia Terengganu	Public
18	Multimedia University	Private
19	Taylor's University	Private
20	Sunway University	Private
21	Monash University Malaysia	Private
22	Asia Pacific University of Technology & Innovation	Private
23	International Medical University	Private
24	University of Nottingham Malaysia	Private
25	HELP University	Private
\.


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 211
-- Name: AcademicStaff_staffid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."AcademicStaff_staffid_seq"', 16, true);


--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 213
-- Name: Student_studentid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Student_studentid_seq"', 29, true);


--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 209
-- Name: User_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."User_userid_seq"', 45, true);


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 215
-- Name: university_uniid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public.university_uniid_seq', 1, false);


--
-- TOC entry 3248 (class 2606 OID 16436)
-- Name: AcademicStaff AcademicStaff_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff"
    ADD CONSTRAINT "AcademicStaff_pkey" PRIMARY KEY (staffid);


--
-- TOC entry 3250 (class 2606 OID 16453)
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (studentid);


--
-- TOC entry 3238 (class 2606 OID 16398)
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- TOC entry 3240 (class 2606 OID 16460)
-- Name: User User_matricnumber_key; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_matricnumber_key" UNIQUE (matricnumber);


--
-- TOC entry 3242 (class 2606 OID 16396)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (userid);


--
-- TOC entry 3244 (class 2606 OID 16462)
-- Name: User matricnumber; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT matricnumber UNIQUE (matricnumber);


--
-- TOC entry 3246 (class 2606 OID 16499)
-- Name: User unique_email; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- TOC entry 3252 (class 2606 OID 16497)
-- Name: university university_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public.university
    ADD CONSTRAINT university_pkey PRIMARY KEY (uniid);


-- Completed on 2024-03-19 01:19:34 +08

--
-- PostgreSQL database dump complete
--
