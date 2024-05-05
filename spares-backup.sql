--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)

-- Started on 2024-04-03 14:53:41 +08

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
    profilepic character varying(255) DEFAULT './assets/defaultProfilePic.jpg'::character varying NOT NULL,
    isstaff boolean,
    isstudent boolean DEFAULT true NOT NULL,
    pastduetasks integer DEFAULT 0 NOT NULL,
    redtasks integer DEFAULT 0 NOT NULL,
    yellowtasks integer DEFAULT 0 NOT NULL
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
-- TOC entry 3557 (class 0 OID 0)
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
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 211
-- Name: AcademicStaff_staffid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."AcademicStaff_staffid_seq" OWNED BY public."AcademicStaff".staffid;


--
-- TOC entry 218 (class 1259 OID 16585)
-- Name: Batch; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Batch" (
    batchid integer NOT NULL,
    batchname character varying(255) NOT NULL,
    batchyear character varying(4) NOT NULL,
    batchstatus boolean DEFAULT false NOT NULL,
    batchimage character varying(255) DEFAULT './assets/default/batch.jpg'::character varying NOT NULL,
    batchhead integer NOT NULL
);


ALTER TABLE public."Batch" OWNER TO kale;

--
-- TOC entry 220 (class 1259 OID 16601)
-- Name: BatchDocumentation; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."BatchDocumentation" (
    batchdocumentationid integer NOT NULL,
    batchid integer NOT NULL,
    batchyear character varying(4) NOT NULL,
    batchdocumentation character varying(255) NOT NULL
);


ALTER TABLE public."BatchDocumentation" OWNER TO kale;

--
-- TOC entry 219 (class 1259 OID 16600)
-- Name: BatchDocumentation_batchdocumentationid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."BatchDocumentation_batchdocumentationid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BatchDocumentation_batchdocumentationid_seq" OWNER TO kale;

--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 219
-- Name: BatchDocumentation_batchdocumentationid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."BatchDocumentation_batchdocumentationid_seq" OWNED BY public."BatchDocumentation".batchdocumentationid;


--
-- TOC entry 217 (class 1259 OID 16584)
-- Name: Batch_batchid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."Batch_batchid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Batch_batchid_seq" OWNER TO kale;

--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 217
-- Name: Batch_batchid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Batch_batchid_seq" OWNED BY public."Batch".batchid;


--
-- TOC entry 234 (class 1259 OID 16763)
-- Name: Event; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Event" (
    eventid integer NOT NULL,
    eventtitle character varying(255) NOT NULL,
    eventdescription text NOT NULL,
    eventdate date NOT NULL,
    eventtime time without time zone NOT NULL,
    gmapembed character varying(255) NOT NULL,
    eventimage character varying(255) DEFAULT './assets/default/event.jpg'::character varying NOT NULL,
    eventhead integer NOT NULL
);


ALTER TABLE public."Event" OWNER TO kale;

--
-- TOC entry 238 (class 1259 OID 16796)
-- Name: EventFiles; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."EventFiles" (
    eventfileid integer NOT NULL,
    eventid integer NOT NULL,
    eventfile character varying(255) NOT NULL
);


ALTER TABLE public."EventFiles" OWNER TO kale;

--
-- TOC entry 237 (class 1259 OID 16795)
-- Name: EventFiles_eventfileid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."EventFiles_eventfileid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EventFiles_eventfileid_seq" OWNER TO kale;

--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 237
-- Name: EventFiles_eventfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."EventFiles_eventfileid_seq" OWNED BY public."EventFiles".eventfileid;


--
-- TOC entry 240 (class 1259 OID 16808)
-- Name: EventSpeaker; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."EventSpeaker" (
    eventspeakerid integer NOT NULL,
    eventid integer NOT NULL,
    eventspeaker character varying(255) NOT NULL,
    eventspeakerimage character varying(255) DEFAULT './assets/default/speaker.jpg'::character varying NOT NULL,
    eventspeakerbio character varying(255)
);


ALTER TABLE public."EventSpeaker" OWNER TO kale;

--
-- TOC entry 239 (class 1259 OID 16807)
-- Name: EventSpeaker_eventspeakerid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."EventSpeaker_eventspeakerid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EventSpeaker_eventspeakerid_seq" OWNER TO kale;

--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 239
-- Name: EventSpeaker_eventspeakerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."EventSpeaker_eventspeakerid_seq" OWNED BY public."EventSpeaker".eventspeakerid;


--
-- TOC entry 236 (class 1259 OID 16778)
-- Name: EventUser; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."EventUser" (
    eventuserid integer NOT NULL,
    eventid integer NOT NULL,
    assignedto integer NOT NULL
);


ALTER TABLE public."EventUser" OWNER TO kale;

--
-- TOC entry 235 (class 1259 OID 16777)
-- Name: EventUser_eventuserid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."EventUser_eventuserid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EventUser_eventuserid_seq" OWNER TO kale;

--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 235
-- Name: EventUser_eventuserid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."EventUser_eventuserid_seq" OWNED BY public."EventUser".eventuserid;


--
-- TOC entry 233 (class 1259 OID 16762)
-- Name: Event_eventid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."Event_eventid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Event_eventid_seq" OWNER TO kale;

--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 233
-- Name: Event_eventid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Event_eventid_seq" OWNED BY public."Event".eventid;


--
-- TOC entry 222 (class 1259 OID 16613)
-- Name: Project; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Project" (
    projectid integer NOT NULL,
    projecttitle character varying(255) NOT NULL,
    projectdescription text NOT NULL,
    approvalstatus boolean DEFAULT false NOT NULL,
    projecttype character varying(255) NOT NULL,
    projectimage character varying(255) DEFAULT './assets/default/project.jpg'::character varying NOT NULL,
    supervisorid integer NOT NULL,
    batchid integer NOT NULL
);


ALTER TABLE public."Project" OWNER TO kale;

--
-- TOC entry 221 (class 1259 OID 16612)
-- Name: Project_projectid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."Project_projectid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Project_projectid_seq" OWNER TO kale;

--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 221
-- Name: Project_projectid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Project_projectid_seq" OWNED BY public."Project".projectid;


--
-- TOC entry 224 (class 1259 OID 16688)
-- Name: RequestToUndertakeProject; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."RequestToUndertakeProject" (
    requestid integer NOT NULL,
    projectid integer NOT NULL,
    studentid integer NOT NULL,
    requeststatus boolean DEFAULT false NOT NULL
);


ALTER TABLE public."RequestToUndertakeProject" OWNER TO kale;

--
-- TOC entry 223 (class 1259 OID 16687)
-- Name: RequestToUndertakeProject_requestid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."RequestToUndertakeProject_requestid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."RequestToUndertakeProject_requestid_seq" OWNER TO kale;

--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 223
-- Name: RequestToUndertakeProject_requestid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."RequestToUndertakeProject_requestid_seq" OWNED BY public."RequestToUndertakeProject".requestid;


--
-- TOC entry 214 (class 1259 OID 16443)
-- Name: Student; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Student" (
    userid integer DEFAULT nextval('public."User_userid_seq"'::regclass),
    studentid integer NOT NULL,
    batchid integer
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
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 213
-- Name: Student_studentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Student_studentid_seq" OWNED BY public."Student".studentid;


--
-- TOC entry 226 (class 1259 OID 16706)
-- Name: Task; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Task" (
    taskid integer NOT NULL,
    tasktitle character varying(255) NOT NULL,
    taskdescription text NOT NULL,
    tasksubmitted boolean DEFAULT false NOT NULL,
    duedate date NOT NULL,
    yellowzone date NOT NULL,
    redzone date NOT NULL,
    lock boolean DEFAULT false NOT NULL,
    assignedfrom integer NOT NULL
);


ALTER TABLE public."Task" OWNER TO kale;

--
-- TOC entry 230 (class 1259 OID 16739)
-- Name: TaskFiles; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."TaskFiles" (
    taskfileid integer NOT NULL,
    taskid integer NOT NULL,
    taskfile character varying(255) NOT NULL
);


ALTER TABLE public."TaskFiles" OWNER TO kale;

--
-- TOC entry 229 (class 1259 OID 16738)
-- Name: TaskFiles_taskfileid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."TaskFiles_taskfileid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TaskFiles_taskfileid_seq" OWNER TO kale;

--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 229
-- Name: TaskFiles_taskfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."TaskFiles_taskfileid_seq" OWNED BY public."TaskFiles".taskfileid;


--
-- TOC entry 232 (class 1259 OID 16751)
-- Name: TaskSubmissionFile; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."TaskSubmissionFile" (
    tasksubmissionfileid integer NOT NULL,
    taskid integer NOT NULL,
    tasksubmissionfile character varying(255) NOT NULL
);


ALTER TABLE public."TaskSubmissionFile" OWNER TO kale;

--
-- TOC entry 231 (class 1259 OID 16750)
-- Name: TaskSubmissionFile_tasksubmissionfileid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."TaskSubmissionFile_tasksubmissionfileid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TaskSubmissionFile_tasksubmissionfileid_seq" OWNER TO kale;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 231
-- Name: TaskSubmissionFile_tasksubmissionfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."TaskSubmissionFile_tasksubmissionfileid_seq" OWNED BY public."TaskSubmissionFile".tasksubmissionfileid;


--
-- TOC entry 228 (class 1259 OID 16722)
-- Name: TaskUser; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."TaskUser" (
    taskuserid integer NOT NULL,
    taskid integer NOT NULL,
    assignedto integer NOT NULL
);


ALTER TABLE public."TaskUser" OWNER TO kale;

--
-- TOC entry 227 (class 1259 OID 16721)
-- Name: TaskUser_taskuserid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."TaskUser_taskuserid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TaskUser_taskuserid_seq" OWNER TO kale;

--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 227
-- Name: TaskUser_taskuserid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."TaskUser_taskuserid_seq" OWNED BY public."TaskUser".taskuserid;


--
-- TOC entry 225 (class 1259 OID 16705)
-- Name: Task_taskid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."Task_taskid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Task_taskid_seq" OWNER TO kale;

--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 225
-- Name: Task_taskid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Task_taskid_seq" OWNED BY public."Task".taskid;


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
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 215
-- Name: university_uniid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public.university_uniid_seq OWNED BY public.university.uniid;


--
-- TOC entry 3289 (class 2604 OID 16431)
-- Name: AcademicStaff profilepic; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN profilepic SET DEFAULT './assets/defaultProfilePic.jpg'::character varying;


--
-- TOC entry 3290 (class 2604 OID 16432)
-- Name: AcademicStaff staffid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN staffid SET DEFAULT nextval('public."AcademicStaff_staffid_seq"'::regclass);


--
-- TOC entry 3291 (class 2604 OID 16487)
-- Name: AcademicStaff isstudent; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN isstudent SET DEFAULT true;


--
-- TOC entry 3292 (class 2604 OID 16834)
-- Name: AcademicStaff pastduetasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN pastduetasks SET DEFAULT 0;


--
-- TOC entry 3293 (class 2604 OID 16837)
-- Name: AcademicStaff redtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN redtasks SET DEFAULT 0;


--
-- TOC entry 3294 (class 2604 OID 16840)
-- Name: AcademicStaff yellowtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN yellowtasks SET DEFAULT 0;


--
-- TOC entry 3303 (class 2604 OID 16588)
-- Name: Batch batchid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Batch" ALTER COLUMN batchid SET DEFAULT nextval('public."Batch_batchid_seq"'::regclass);


--
-- TOC entry 3306 (class 2604 OID 16604)
-- Name: BatchDocumentation batchdocumentationid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchDocumentation" ALTER COLUMN batchdocumentationid SET DEFAULT nextval('public."BatchDocumentation_batchdocumentationid_seq"'::regclass);


--
-- TOC entry 3318 (class 2604 OID 16766)
-- Name: Event eventid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Event" ALTER COLUMN eventid SET DEFAULT nextval('public."Event_eventid_seq"'::regclass);


--
-- TOC entry 3321 (class 2604 OID 16799)
-- Name: EventFiles eventfileid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventFiles" ALTER COLUMN eventfileid SET DEFAULT nextval('public."EventFiles_eventfileid_seq"'::regclass);


--
-- TOC entry 3322 (class 2604 OID 16811)
-- Name: EventSpeaker eventspeakerid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventSpeaker" ALTER COLUMN eventspeakerid SET DEFAULT nextval('public."EventSpeaker_eventspeakerid_seq"'::regclass);


--
-- TOC entry 3320 (class 2604 OID 16781)
-- Name: EventUser eventuserid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventUser" ALTER COLUMN eventuserid SET DEFAULT nextval('public."EventUser_eventuserid_seq"'::regclass);


--
-- TOC entry 3307 (class 2604 OID 16616)
-- Name: Project projectid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Project" ALTER COLUMN projectid SET DEFAULT nextval('public."Project_projectid_seq"'::regclass);


--
-- TOC entry 3310 (class 2604 OID 16691)
-- Name: RequestToUndertakeProject requestid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."RequestToUndertakeProject" ALTER COLUMN requestid SET DEFAULT nextval('public."RequestToUndertakeProject_requestid_seq"'::regclass);


--
-- TOC entry 3296 (class 2604 OID 16448)
-- Name: Student profilepic; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN profilepic SET DEFAULT './assets/defaultProfilePic.jpg'::character varying;


--
-- TOC entry 3297 (class 2604 OID 16449)
-- Name: Student studentid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN studentid SET DEFAULT nextval('public."Student_studentid_seq"'::regclass);


--
-- TOC entry 3298 (class 2604 OID 16488)
-- Name: Student isstudent; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN isstudent SET DEFAULT true;


--
-- TOC entry 3299 (class 2604 OID 16835)
-- Name: Student pastduetasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN pastduetasks SET DEFAULT 0;


--
-- TOC entry 3300 (class 2604 OID 16838)
-- Name: Student redtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN redtasks SET DEFAULT 0;


--
-- TOC entry 3301 (class 2604 OID 16841)
-- Name: Student yellowtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN yellowtasks SET DEFAULT 0;


--
-- TOC entry 3312 (class 2604 OID 16709)
-- Name: Task taskid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Task" ALTER COLUMN taskid SET DEFAULT nextval('public."Task_taskid_seq"'::regclass);


--
-- TOC entry 3316 (class 2604 OID 16742)
-- Name: TaskFiles taskfileid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskFiles" ALTER COLUMN taskfileid SET DEFAULT nextval('public."TaskFiles_taskfileid_seq"'::regclass);


--
-- TOC entry 3317 (class 2604 OID 16754)
-- Name: TaskSubmissionFile tasksubmissionfileid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskSubmissionFile" ALTER COLUMN tasksubmissionfileid SET DEFAULT nextval('public."TaskSubmissionFile_tasksubmissionfileid_seq"'::regclass);


--
-- TOC entry 3315 (class 2604 OID 16725)
-- Name: TaskUser taskuserid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskUser" ALTER COLUMN taskuserid SET DEFAULT nextval('public."TaskUser_taskuserid_seq"'::regclass);


--
-- TOC entry 3282 (class 2604 OID 16390)
-- Name: User userid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User" ALTER COLUMN userid SET DEFAULT nextval('public."User_userid_seq"'::regclass);


--
-- TOC entry 3302 (class 2604 OID 16493)
-- Name: university uniid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public.university ALTER COLUMN uniid SET DEFAULT nextval('public.university_uniid_seq'::regclass);


--
-- TOC entry 3523 (class 0 OID 16426)
-- Dependencies: 212
-- Data for Name: AcademicStaff; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."AcademicStaff" (userid, email, salt, password, name, dob, matricnumber, institution, profilepic, staffid, iscoordinator, issupervisor, isstaff, isstudent, pastduetasks, redtasks, yellowtasks) FROM stdin;
\.


--
-- TOC entry 3529 (class 0 OID 16585)
-- Dependencies: 218
-- Data for Name: Batch; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Batch" (batchid, batchname, batchyear, batchstatus, batchimage, batchhead) FROM stdin;
\.


--
-- TOC entry 3531 (class 0 OID 16601)
-- Dependencies: 220
-- Data for Name: BatchDocumentation; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."BatchDocumentation" (batchdocumentationid, batchid, batchyear, batchdocumentation) FROM stdin;
\.


--
-- TOC entry 3545 (class 0 OID 16763)
-- Dependencies: 234
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Event" (eventid, eventtitle, eventdescription, eventdate, eventtime, gmapembed, eventimage, eventhead) FROM stdin;
\.


--
-- TOC entry 3549 (class 0 OID 16796)
-- Dependencies: 238
-- Data for Name: EventFiles; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."EventFiles" (eventfileid, eventid, eventfile) FROM stdin;
\.


--
-- TOC entry 3551 (class 0 OID 16808)
-- Dependencies: 240
-- Data for Name: EventSpeaker; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."EventSpeaker" (eventspeakerid, eventid, eventspeaker, eventspeakerimage, eventspeakerbio) FROM stdin;
\.


--
-- TOC entry 3547 (class 0 OID 16778)
-- Dependencies: 236
-- Data for Name: EventUser; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."EventUser" (eventuserid, eventid, assignedto) FROM stdin;
\.


--
-- TOC entry 3533 (class 0 OID 16613)
-- Dependencies: 222
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Project" (projectid, projecttitle, projectdescription, approvalstatus, projecttype, projectimage, supervisorid, batchid) FROM stdin;
\.


--
-- TOC entry 3535 (class 0 OID 16688)
-- Dependencies: 224
-- Data for Name: RequestToUndertakeProject; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."RequestToUndertakeProject" (requestid, projectid, studentid, requeststatus) FROM stdin;
\.


--
-- TOC entry 3525 (class 0 OID 16443)
-- Dependencies: 214
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Student" (userid, email, salt, password, name, dob, matricnumber, institution, profilepic, studentid, batchid, isstaff, isstudent, pastduetasks, redtasks, yellowtasks) FROM stdin;
46	johndoe@mail.com	$2b$10$dYGjTfh7nRMHt9UPngWJdu	$2b$10$dYGjTfh7nRMHt9UPngWJduiKFumP1OzIsEGOSIMrRDZH2RkWfB4fG	John Doe	2001-01-01	123456	Universiti Utara Malaysia	./assets/defaultProfilePic.jpg	30	\N	f	t	0	0	0
47	haikal22@gmail.com	$2b$10$1BzSofXhwz/uCB5ocBkPbe	$2b$10$1BzSofXhwz/uCB5ocBkPbep3um.Zn5wieev9hFdLMMGmuhd/kth3u	Muhammad Haikal	2002-10-06	283950	Universiti Utara Malaysia	./assets/defaultProfilePic.jpg	31	\N	f	t	0	0	0
\.


--
-- TOC entry 3537 (class 0 OID 16706)
-- Dependencies: 226
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Task" (taskid, tasktitle, taskdescription, tasksubmitted, duedate, yellowzone, redzone, lock, assignedfrom) FROM stdin;
\.


--
-- TOC entry 3541 (class 0 OID 16739)
-- Dependencies: 230
-- Data for Name: TaskFiles; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."TaskFiles" (taskfileid, taskid, taskfile) FROM stdin;
\.


--
-- TOC entry 3543 (class 0 OID 16751)
-- Dependencies: 232
-- Data for Name: TaskSubmissionFile; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."TaskSubmissionFile" (tasksubmissionfileid, taskid, tasksubmissionfile) FROM stdin;
\.


--
-- TOC entry 3539 (class 0 OID 16722)
-- Dependencies: 228
-- Data for Name: TaskUser; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."TaskUser" (taskuserid, taskid, assignedto) FROM stdin;
\.


--
-- TOC entry 3521 (class 0 OID 16387)
-- Dependencies: 210
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."User" (userid, email, salt, password, name, dob, matricnumber, institution, profilepic, isstaff, isstudent, pastduetasks, redtasks, yellowtasks) FROM stdin;
CREATE TABLE public.university (
    uniid integer NOT NULL,
    uniname character varying(100) NOT NULL,
    typeofuni character varying(20) NOT NULL
);

CREATE TABLE public."AcademicStaff" (
    staffid integer NOT NULL,
    staffname character varying(100) NOT NULL,
    staffemail character varying(100) NOT NULL,
    staffpassword character varying(100) NOT NULL,
    staffposition character varying(100) NOT NULL,
    staffdepartment character varying(100) NOT NULL,
    staffphone character varying(20) NOT NULL
);

CREATE TABLE public."BatchDocumentation" (
    batchdocumentationid integer NOT NULL,
    batchid integer NOT NULL,
    documentationname character varying(100) NOT NULL,
    documentationfile bytea NOT NULL
);

CREATE TABLE public."Batch" (
    batchid integer NOT NULL,
    batchname character varying(100) NOT NULL,
    batchhead integer NOT NULL
);

CREATE TABLE public."EventFiles" (
    eventfileid integer NOT NULL,
    eventid integer NOT NULL,
    eventfilename character varying(100) NOT NULL,
    eventfile bytea NOT NULL
);

CREATE TABLE public."EventSpeaker" (
    eventspeakerid integer NOT NULL,
    eventid integer NOT NULL,
    speakername character varying(100) NOT NULL,
    speakeremail character varying(100) NOT NULL,
    speakerphone character varying(20) NOT NULL
);

CREATE TABLE public."EventUser" (
    eventuserid integer NOT NULL,
    eventid integer NOT NULL,
    assignedto integer NOT NULL
);

CREATE TABLE public."Event" (
    eventid integer NOT NULL,
    eventname character varying(100) NOT NULL,
    eventdate date NOT NULL,
    eventtime time without time zone NOT NULL,
    eventvenue character varying(100) NOT NULL,
    eventhead integer NOT NULL
);

CREATE TABLE public."Project" (
    projectid integer NOT NULL,
    projectname character varying(100) NOT NULL,
    projectdescription text NOT NULL,
    projectstatus character varying(20) NOT NULL,
    batchid integer NOT NULL,
    supervisorid integer NOT NULL
);

CREATE TABLE public."RequestToUndertakeProject" (
    requestid integer NOT NULL,
    projectid integer NOT NULL,
    studentid integer NOT NULL,
    requeststatus character varying(20) NOT NULL
);

CREATE TABLE public."Student" (
    studentid integer NOT NULL,
    studentname character varying(100) NOT NULL,
    studentemail character varying(100) NOT NULL,
    studentpassword character varying(100) NOT NULL,
    studentmatric character varying(20) NOT NULL,
    studentphone character varying(20) NOT NULL,
    batchid integer NOT NULL
);

CREATE TABLE public."TaskFiles" (
    taskfileid integer NOT NULL,
    taskid integer NOT NULL,
    taskfilename character varying(100) NOT NULL,
    taskfile bytea NOT NULL
);

CREATE TABLE public."TaskSubmissionFile" (
    tasksubmissionfileid integer NOT NULL,
    taskid integer NOT NULL,
    submissionfilename character varying(100) NOT NULL,
    submissionfile bytea NOT NULL
);

CREATE TABLE public."TaskUser" (
    taskuserid integer NOT NULL,
    taskid integer NOT NULL,
    assignedto integer NOT NULL
);

CREATE TABLE public."Task" (
    taskid integer NOT NULL,
    taskname character varying(100) NOT NULL,
    taskdescription text NOT NULL,
    taskstatus character varying(20) NOT NULL,
    taskdeadline date NOT NULL,
    assignedfrom integer NOT NULL
);

CREATE TABLE public."User" (
    userid integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(20) NOT NULL,
    matricnumber character varying(20) NOT NULL,
    phone character varying(20) NOT NULL
);
