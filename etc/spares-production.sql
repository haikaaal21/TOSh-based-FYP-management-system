--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)

-- Started on 2024-06-19 01:21:46 +08

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

--
-- TOC entry 2 (class 3079 OID 17287)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 258 (class 1255 OID 17228)
-- Name: backup_deleted_row(); Type: FUNCTION; Schema: public; Owner: kale
--

CREATE FUNCTION public.backup_deleted_row() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    insert into "ProjectBin" values (old.*);
    return old;
end;
$$;


ALTER FUNCTION public.backup_deleted_row() OWNER TO kale;

--
-- TOC entry 260 (class 1255 OID 17285)
-- Name: delete_false_requests(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_false_requests() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.requeststatus = true THEN
    DELETE FROM "ProjectStudent"
    WHERE studentid = NEW.studentid AND requeststatus = false;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.delete_false_requests() OWNER TO postgres;

--
-- TOC entry 256 (class 1255 OID 17357)
-- Name: prevent_status_change(); Type: FUNCTION; Schema: public; Owner: kale
--

CREATE FUNCTION public.prevent_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF OLD.complaintstatus = 'Closed' THEN
    RAISE EXCEPTION 'Cannot change complaint status once it is closed';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_status_change() OWNER TO kale;

--
-- TOC entry 309 (class 1255 OID 17381)
-- Name: trg_new_user_func(); Type: FUNCTION; Schema: public; Owner: kale
--

CREATE FUNCTION public.trg_new_user_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO "BetaTester" (email) VALUES (NEW.email);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.trg_new_user_func() OWNER TO kale;

--
-- TOC entry 306 (class 1255 OID 17351)
-- Name: update_shamepoints(); Type: FUNCTION; Schema: public; Owner: kale
--

CREATE FUNCTION public.update_shamepoints() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.submissionstatus = true AND OLD.submissionstatus = false THEN
    UPDATE "User"
    SET shamepoints = shamepoints - 2
    WHERE userid = NEW.userid;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_shamepoints() OWNER TO kale;

--
-- TOC entry 259 (class 1255 OID 16938)
-- Name: update_tag(); Type: FUNCTION; Schema: public; Owner: kale
--

CREATE FUNCTION public.update_tag() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if the projecttype already exists in the Tag table
    IF EXISTS (SELECT 1 FROM "Tag" WHERE tagname = NEW.projecttype) THEN
        -- If it exists, increase the tagcount by 1
        UPDATE "Tag" SET tagcount = tagcount + 1 WHERE tagname = NEW.projecttype;
    ELSE
        -- If it doesn't exist, insert a new row with the projecttype and tagcount = 1
        INSERT INTO "Tag" (tagname, tagcount) VALUES (NEW.projecttype, 1);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_tag() OWNER TO kale;

--
-- TOC entry 257 (class 1255 OID 16947)
-- Name: update_task_submitted(); Type: FUNCTION; Schema: public; Owner: kale
--

CREATE FUNCTION public.update_task_submitted() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW."TaskSubmissionFile" <> OLD."TaskSubmissionFile" THEN
        UPDATE "TaskUser"
        SET submissionstatus = TRUE
        WHERE taskid = NEW.taskid;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_task_submitted() OWNER TO kale;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 16387)
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
    profilepic character varying(255),
    isstaff boolean,
    isstudent boolean NOT NULL,
    pastduetasks integer DEFAULT 0 NOT NULL,
    redtasks integer DEFAULT 0 NOT NULL,
    yellowtasks integer DEFAULT 0 NOT NULL,
    shamepoints integer DEFAULT 0 NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    verificationkey uuid DEFAULT gen_random_uuid()
);


ALTER TABLE public."User" OWNER TO kale;

--
-- TOC entry 210 (class 1259 OID 16386)
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
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 210
-- Name: User_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."User_userid_seq" OWNED BY public."User".userid;


--
-- TOC entry 213 (class 1259 OID 16426)
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
-- TOC entry 212 (class 1259 OID 16425)
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
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 212
-- Name: AcademicStaff_staffid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."AcademicStaff_staffid_seq" OWNED BY public."AcademicStaff".staffid;


--
-- TOC entry 219 (class 1259 OID 16585)
-- Name: Batch; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Batch" (
    batchid integer NOT NULL,
    batchname character varying(255) NOT NULL,
    batchyear character varying(4) NOT NULL,
    batchstatus character varying(35) DEFAULT 'Preparation'::character varying NOT NULL,
    batchhead integer NOT NULL
);


ALTER TABLE public."Batch" OWNER TO kale;

--
-- TOC entry 221 (class 1259 OID 16601)
-- Name: BatchDocumentation; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."BatchDocumentation" (
    batchdocumentationid integer NOT NULL,
    batchid integer NOT NULL,
    documentationtitle character varying(255) NOT NULL,
    batchdocumentation character varying(255) NOT NULL
);


ALTER TABLE public."BatchDocumentation" OWNER TO kale;

--
-- TOC entry 220 (class 1259 OID 16600)
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
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 220
-- Name: BatchDocumentation_batchdocumentationid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."BatchDocumentation_batchdocumentationid_seq" OWNED BY public."BatchDocumentation".batchdocumentationid;


--
-- TOC entry 248 (class 1259 OID 17160)
-- Name: BatchSupervisor; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."BatchSupervisor" (
    supervisorid integer NOT NULL,
    batchid integer NOT NULL,
    batchsupervisorid integer NOT NULL
);


ALTER TABLE public."BatchSupervisor" OWNER TO kale;

--
-- TOC entry 249 (class 1259 OID 17184)
-- Name: BatchSupervisor_batchsupervisorid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."BatchSupervisor_batchsupervisorid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BatchSupervisor_batchsupervisorid_seq" OWNER TO kale;

--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 249
-- Name: BatchSupervisor_batchsupervisorid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."BatchSupervisor_batchsupervisorid_seq" OWNED BY public."BatchSupervisor".batchsupervisorid;


--
-- TOC entry 218 (class 1259 OID 16584)
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
-- TOC entry 3713 (class 0 OID 0)
-- Dependencies: 218
-- Name: Batch_batchid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Batch_batchid_seq" OWNED BY public."Batch".batchid;


--
-- TOC entry 253 (class 1259 OID 17375)
-- Name: BetaTester; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."BetaTester" (
    email character varying(255) NOT NULL,
    sentlink boolean DEFAULT false NOT NULL
);


ALTER TABLE public."BetaTester" OWNER TO kale;

--
-- TOC entry 243 (class 1259 OID 16971)
-- Name: Complaint; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Complaint" (
    complaintid integer NOT NULL,
    studentid integer NOT NULL,
    complainttitle character varying(100) NOT NULL,
    complainttext text NOT NULL,
    complaintstatus character varying(55) DEFAULT 'Pending'::character varying NOT NULL,
    complaintnotification integer DEFAULT 0 NOT NULL,
    complaintdate date NOT NULL,
    CONSTRAINT status_check CHECK (((complaintstatus)::text ~~* ANY (ARRAY['Pending'::text, 'Under Review'::text, 'Under Process'::text, 'Closed'::text])))
);


ALTER TABLE public."Complaint" OWNER TO kale;

--
-- TOC entry 245 (class 1259 OID 16985)
-- Name: ComplaintFile; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."ComplaintFile" (
    complaintfileid integer NOT NULL,
    complaintid integer NOT NULL,
    complaintfilename character varying(100) NOT NULL,
    complaintfiletype character varying(20) NOT NULL,
    complaintfiletitle character varying(255) DEFAULT 'Default'::character varying NOT NULL
);


ALTER TABLE public."ComplaintFile" OWNER TO kale;

--
-- TOC entry 244 (class 1259 OID 16984)
-- Name: ComplaintFile_complaintfileid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."ComplaintFile_complaintfileid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ComplaintFile_complaintfileid_seq" OWNER TO kale;

--
-- TOC entry 3715 (class 0 OID 0)
-- Dependencies: 244
-- Name: ComplaintFile_complaintfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."ComplaintFile_complaintfileid_seq" OWNED BY public."ComplaintFile".complaintfileid;


--
-- TOC entry 247 (class 1259 OID 17002)
-- Name: ComplaintReply; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."ComplaintReply" (
    complaintreplyid integer NOT NULL,
    complaintid integer NOT NULL,
    userid integer NOT NULL,
    complaintreplytext text NOT NULL,
    complaintreplydate date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public."ComplaintReply" OWNER TO kale;

--
-- TOC entry 246 (class 1259 OID 17001)
-- Name: ComplaintReply_complaintreplyid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."ComplaintReply_complaintreplyid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ComplaintReply_complaintreplyid_seq" OWNER TO kale;

--
-- TOC entry 3716 (class 0 OID 0)
-- Dependencies: 246
-- Name: ComplaintReply_complaintreplyid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."ComplaintReply_complaintreplyid_seq" OWNED BY public."ComplaintReply".complaintreplyid;


--
-- TOC entry 242 (class 1259 OID 16970)
-- Name: Complaint_complaintid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."Complaint_complaintid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Complaint_complaintid_seq" OWNER TO kale;

--
-- TOC entry 3717 (class 0 OID 0)
-- Dependencies: 242
-- Name: Complaint_complaintid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Complaint_complaintid_seq" OWNED BY public."Complaint".complaintid;


--
-- TOC entry 235 (class 1259 OID 16763)
-- Name: Event; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Event" (
    eventid integer NOT NULL,
    eventtitle character varying(255) NOT NULL,
    eventdescription text NOT NULL,
    eventdate date NOT NULL,
    eventtime time without time zone NOT NULL,
    gmapembed text NOT NULL,
    eventimage character varying(255) DEFAULT './assets/default/event.jpg'::character varying,
    eventhead integer NOT NULL,
    batch integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Event" OWNER TO kale;

--
-- TOC entry 251 (class 1259 OID 17199)
-- Name: EventBatch; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."EventBatch" (
    eventbatchid integer NOT NULL,
    eventid integer NOT NULL,
    batchid integer NOT NULL
);


ALTER TABLE public."EventBatch" OWNER TO kale;

--
-- TOC entry 250 (class 1259 OID 17198)
-- Name: EventBatch_eventbatchid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."EventBatch_eventbatchid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EventBatch_eventbatchid_seq" OWNER TO kale;

--
-- TOC entry 3718 (class 0 OID 0)
-- Dependencies: 250
-- Name: EventBatch_eventbatchid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."EventBatch_eventbatchid_seq" OWNED BY public."EventBatch".eventbatchid;


--
-- TOC entry 239 (class 1259 OID 16796)
-- Name: EventFiles; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."EventFiles" (
    eventfileid integer NOT NULL,
    eventid integer NOT NULL,
    eventfile character varying(255) NOT NULL,
    eventfilename character varying(255) NOT NULL,
    filetype character varying(255) DEFAULT 'unknown'::character varying NOT NULL
);


ALTER TABLE public."EventFiles" OWNER TO kale;

--
-- TOC entry 238 (class 1259 OID 16795)
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
-- TOC entry 3719 (class 0 OID 0)
-- Dependencies: 238
-- Name: EventFiles_eventfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."EventFiles_eventfileid_seq" OWNED BY public."EventFiles".eventfileid;


--
-- TOC entry 241 (class 1259 OID 16808)
-- Name: EventSpeaker; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."EventSpeaker" (
    eventspeakerid integer NOT NULL,
    eventid integer NOT NULL,
    eventspeaker character varying(255) NOT NULL,
    eventspeakerimage character varying(255),
    eventspeakerbio character varying(255),
    eventspeakercontact character varying(255)
);


ALTER TABLE public."EventSpeaker" OWNER TO kale;

--
-- TOC entry 240 (class 1259 OID 16807)
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
-- TOC entry 3720 (class 0 OID 0)
-- Dependencies: 240
-- Name: EventSpeaker_eventspeakerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."EventSpeaker_eventspeakerid_seq" OWNED BY public."EventSpeaker".eventspeakerid;


--
-- TOC entry 237 (class 1259 OID 16778)
-- Name: EventUser; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."EventUser" (
    eventuserid integer NOT NULL,
    eventid integer NOT NULL,
    assignedto integer NOT NULL,
    attended boolean DEFAULT false NOT NULL
);


ALTER TABLE public."EventUser" OWNER TO kale;

--
-- TOC entry 236 (class 1259 OID 16777)
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
-- TOC entry 3721 (class 0 OID 0)
-- Dependencies: 236
-- Name: EventUser_eventuserid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."EventUser_eventuserid_seq" OWNED BY public."EventUser".eventuserid;


--
-- TOC entry 234 (class 1259 OID 16762)
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
-- TOC entry 3722 (class 0 OID 0)
-- Dependencies: 234
-- Name: Event_eventid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Event_eventid_seq" OWNED BY public."Event".eventid;


--
-- TOC entry 223 (class 1259 OID 16613)
-- Name: Project; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Project" (
    projectid integer NOT NULL,
    projecttitle character varying(255) NOT NULL,
    projectdescription text NOT NULL,
    approvalstatus boolean DEFAULT false NOT NULL,
    projecttype character varying(255) NOT NULL,
    projectimage character varying(255),
    supervisorid integer NOT NULL,
    batchid integer NOT NULL,
    intromarkdown character varying(255),
    recruitment boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Project" OWNER TO kale;

--
-- TOC entry 252 (class 1259 OID 17366)
-- Name: ProjectBin; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."ProjectBin" (
    projectid integer NOT NULL,
    projecttitle character varying(255) NOT NULL,
    projectdescription text NOT NULL,
    approvalstatus boolean NOT NULL,
    projecttype character varying(255) NOT NULL,
    projectimage character varying(255),
    supervisorid integer NOT NULL,
    batchid integer NOT NULL,
    intromarkdown character varying(255),
    recruitment boolean NOT NULL,
    "onDeletionKey" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."ProjectBin" OWNER TO kale;

--
-- TOC entry 225 (class 1259 OID 16688)
-- Name: ProjectStudent; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."ProjectStudent" (
    requestid integer NOT NULL,
    projectid integer NOT NULL,
    studentid integer NOT NULL,
    requeststatus boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ProjectStudent" OWNER TO kale;

--
-- TOC entry 222 (class 1259 OID 16612)
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
-- TOC entry 3723 (class 0 OID 0)
-- Dependencies: 222
-- Name: Project_projectid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Project_projectid_seq" OWNED BY public."Project".projectid;


--
-- TOC entry 224 (class 1259 OID 16687)
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
-- TOC entry 3724 (class 0 OID 0)
-- Dependencies: 224
-- Name: RequestToUndertakeProject_requestid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."RequestToUndertakeProject_requestid_seq" OWNED BY public."ProjectStudent".requestid;


--
-- TOC entry 215 (class 1259 OID 16443)
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
-- TOC entry 214 (class 1259 OID 16442)
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
-- TOC entry 3725 (class 0 OID 0)
-- Dependencies: 214
-- Name: Student_studentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Student_studentid_seq" OWNED BY public."Student".studentid;


--
-- TOC entry 255 (class 1259 OID 17445)
-- Name: Tag; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Tag" (
    tagid integer NOT NULL,
    tagname character varying(255) NOT NULL,
    tagcount integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Tag" OWNER TO kale;

--
-- TOC entry 254 (class 1259 OID 17444)
-- Name: Tag_tagid_seq; Type: SEQUENCE; Schema: public; Owner: kale
--

CREATE SEQUENCE public."Tag_tagid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tag_tagid_seq" OWNER TO kale;

--
-- TOC entry 3726 (class 0 OID 0)
-- Dependencies: 254
-- Name: Tag_tagid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Tag_tagid_seq" OWNED BY public."Tag".tagid;


--
-- TOC entry 227 (class 1259 OID 16706)
-- Name: Task; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."Task" (
    taskid integer NOT NULL,
    tasktitle character varying(255) NOT NULL,
    taskdescription text NOT NULL,
    duedate date NOT NULL,
    yellowzone date NOT NULL,
    redzone date NOT NULL,
    lock boolean DEFAULT false NOT NULL,
    assignedfrom integer NOT NULL,
    batchid integer
);


ALTER TABLE public."Task" OWNER TO kale;

--
-- TOC entry 231 (class 1259 OID 16739)
-- Name: TaskFiles; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."TaskFiles" (
    taskfileid integer NOT NULL,
    taskid integer NOT NULL,
    taskfile character varying(255) NOT NULL,
    taskfilename character varying(255) NOT NULL,
    filetype character varying(255) DEFAULT 'unknown'::character varying NOT NULL
);


ALTER TABLE public."TaskFiles" OWNER TO kale;

--
-- TOC entry 230 (class 1259 OID 16738)
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
-- TOC entry 3727 (class 0 OID 0)
-- Dependencies: 230
-- Name: TaskFiles_taskfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."TaskFiles_taskfileid_seq" OWNED BY public."TaskFiles".taskfileid;


--
-- TOC entry 233 (class 1259 OID 16751)
-- Name: TaskSubmissionFile; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."TaskSubmissionFile" (
    tasksubmissionfileid integer NOT NULL,
    taskid integer NOT NULL,
    tasksubmissionfile character varying(255) NOT NULL,
    userid integer NOT NULL,
    typeoffile character varying(255) NOT NULL,
    filename character varying(255) DEFAULT 'untitled'::character varying NOT NULL
);


ALTER TABLE public."TaskSubmissionFile" OWNER TO kale;

--
-- TOC entry 232 (class 1259 OID 16750)
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
-- TOC entry 3728 (class 0 OID 0)
-- Dependencies: 232
-- Name: TaskSubmissionFile_tasksubmissionfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."TaskSubmissionFile_tasksubmissionfileid_seq" OWNED BY public."TaskSubmissionFile".tasksubmissionfileid;


--
-- TOC entry 229 (class 1259 OID 16722)
-- Name: TaskUser; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public."TaskUser" (
    taskuserid integer NOT NULL,
    taskid integer NOT NULL,
    userid integer NOT NULL,
    submissionstatus boolean DEFAULT false NOT NULL,
    isyellowshamed boolean DEFAULT false NOT NULL,
    isredshamed boolean DEFAULT false NOT NULL,
    isblackshamed boolean DEFAULT false NOT NULL
);


ALTER TABLE public."TaskUser" OWNER TO kale;

--
-- TOC entry 228 (class 1259 OID 16721)
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
-- TOC entry 3729 (class 0 OID 0)
-- Dependencies: 228
-- Name: TaskUser_taskuserid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."TaskUser_taskuserid_seq" OWNED BY public."TaskUser".taskuserid;


--
-- TOC entry 226 (class 1259 OID 16705)
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
-- TOC entry 3730 (class 0 OID 0)
-- Dependencies: 226
-- Name: Task_taskid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public."Task_taskid_seq" OWNED BY public."Task".taskid;


--
-- TOC entry 217 (class 1259 OID 16490)
-- Name: university; Type: TABLE; Schema: public; Owner: kale
--

CREATE TABLE public.university (
    uniid integer NOT NULL,
    uniname character varying(255) NOT NULL,
    typeofuni character varying(255) NOT NULL
);


ALTER TABLE public.university OWNER TO kale;

--
-- TOC entry 216 (class 1259 OID 16489)
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
-- TOC entry 3731 (class 0 OID 0)
-- Dependencies: 216
-- Name: university_uniid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kale
--

ALTER SEQUENCE public.university_uniid_seq OWNED BY public.university.uniid;


--
-- TOC entry 3372 (class 2604 OID 16432)
-- Name: AcademicStaff staffid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN staffid SET DEFAULT nextval('public."AcademicStaff_staffid_seq"'::regclass);


--
-- TOC entry 3376 (class 2604 OID 16868)
-- Name: AcademicStaff isstaff; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN isstaff SET DEFAULT true;


--
-- TOC entry 3377 (class 2604 OID 16869)
-- Name: AcademicStaff isstudent; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN isstudent SET DEFAULT false;


--
-- TOC entry 3373 (class 2604 OID 16834)
-- Name: AcademicStaff pastduetasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN pastduetasks SET DEFAULT 0;


--
-- TOC entry 3374 (class 2604 OID 16837)
-- Name: AcademicStaff redtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN redtasks SET DEFAULT 0;


--
-- TOC entry 3375 (class 2604 OID 16840)
-- Name: AcademicStaff yellowtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN yellowtasks SET DEFAULT 0;


--
-- TOC entry 3378 (class 2604 OID 16943)
-- Name: AcademicStaff shamepoints; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN shamepoints SET DEFAULT 0;


--
-- TOC entry 3379 (class 2604 OID 17276)
-- Name: AcademicStaff verified; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN verified SET DEFAULT false;


--
-- TOC entry 3380 (class 2604 OID 17325)
-- Name: AcademicStaff verificationkey; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff" ALTER COLUMN verificationkey SET DEFAULT gen_random_uuid();


--
-- TOC entry 3392 (class 2604 OID 16588)
-- Name: Batch batchid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Batch" ALTER COLUMN batchid SET DEFAULT nextval('public."Batch_batchid_seq"'::regclass);


--
-- TOC entry 3395 (class 2604 OID 16604)
-- Name: BatchDocumentation batchdocumentationid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchDocumentation" ALTER COLUMN batchdocumentationid SET DEFAULT nextval('public."BatchDocumentation_batchdocumentationid_seq"'::regclass);


--
-- TOC entry 3428 (class 2604 OID 17185)
-- Name: BatchSupervisor batchsupervisorid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchSupervisor" ALTER COLUMN batchsupervisorid SET DEFAULT nextval('public."BatchSupervisor_batchsupervisorid_seq"'::regclass);


--
-- TOC entry 3420 (class 2604 OID 16974)
-- Name: Complaint complaintid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Complaint" ALTER COLUMN complaintid SET DEFAULT nextval('public."Complaint_complaintid_seq"'::regclass);


--
-- TOC entry 3424 (class 2604 OID 16988)
-- Name: ComplaintFile complaintfileid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ComplaintFile" ALTER COLUMN complaintfileid SET DEFAULT nextval('public."ComplaintFile_complaintfileid_seq"'::regclass);


--
-- TOC entry 3426 (class 2604 OID 17005)
-- Name: ComplaintReply complaintreplyid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ComplaintReply" ALTER COLUMN complaintreplyid SET DEFAULT nextval('public."ComplaintReply_complaintreplyid_seq"'::regclass);


--
-- TOC entry 3412 (class 2604 OID 16766)
-- Name: Event eventid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Event" ALTER COLUMN eventid SET DEFAULT nextval('public."Event_eventid_seq"'::regclass);


--
-- TOC entry 3429 (class 2604 OID 17202)
-- Name: EventBatch eventbatchid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventBatch" ALTER COLUMN eventbatchid SET DEFAULT nextval('public."EventBatch_eventbatchid_seq"'::regclass);


--
-- TOC entry 3417 (class 2604 OID 16799)
-- Name: EventFiles eventfileid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventFiles" ALTER COLUMN eventfileid SET DEFAULT nextval('public."EventFiles_eventfileid_seq"'::regclass);


--
-- TOC entry 3419 (class 2604 OID 16811)
-- Name: EventSpeaker eventspeakerid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventSpeaker" ALTER COLUMN eventspeakerid SET DEFAULT nextval('public."EventSpeaker_eventspeakerid_seq"'::regclass);


--
-- TOC entry 3415 (class 2604 OID 16781)
-- Name: EventUser eventuserid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventUser" ALTER COLUMN eventuserid SET DEFAULT nextval('public."EventUser_eventuserid_seq"'::regclass);


--
-- TOC entry 3396 (class 2604 OID 16616)
-- Name: Project projectid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Project" ALTER COLUMN projectid SET DEFAULT nextval('public."Project_projectid_seq"'::regclass);


--
-- TOC entry 3399 (class 2604 OID 16691)
-- Name: ProjectStudent requestid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ProjectStudent" ALTER COLUMN requestid SET DEFAULT nextval('public."RequestToUndertakeProject_requestid_seq"'::regclass);


--
-- TOC entry 3382 (class 2604 OID 16449)
-- Name: Student studentid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN studentid SET DEFAULT nextval('public."Student_studentid_seq"'::regclass);


--
-- TOC entry 3386 (class 2604 OID 16866)
-- Name: Student isstaff; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN isstaff SET DEFAULT false;


--
-- TOC entry 3387 (class 2604 OID 16867)
-- Name: Student isstudent; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN isstudent SET DEFAULT true;


--
-- TOC entry 3383 (class 2604 OID 16835)
-- Name: Student pastduetasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN pastduetasks SET DEFAULT 0;


--
-- TOC entry 3384 (class 2604 OID 16838)
-- Name: Student redtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN redtasks SET DEFAULT 0;


--
-- TOC entry 3385 (class 2604 OID 16841)
-- Name: Student yellowtasks; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN yellowtasks SET DEFAULT 0;


--
-- TOC entry 3388 (class 2604 OID 16944)
-- Name: Student shamepoints; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN shamepoints SET DEFAULT 0;


--
-- TOC entry 3389 (class 2604 OID 17277)
-- Name: Student verified; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN verified SET DEFAULT false;


--
-- TOC entry 3390 (class 2604 OID 17326)
-- Name: Student verificationkey; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student" ALTER COLUMN verificationkey SET DEFAULT gen_random_uuid();


--
-- TOC entry 3432 (class 2604 OID 17448)
-- Name: Tag tagid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Tag" ALTER COLUMN tagid SET DEFAULT nextval('public."Tag_tagid_seq"'::regclass);


--
-- TOC entry 3401 (class 2604 OID 16709)
-- Name: Task taskid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Task" ALTER COLUMN taskid SET DEFAULT nextval('public."Task_taskid_seq"'::regclass);


--
-- TOC entry 3408 (class 2604 OID 16742)
-- Name: TaskFiles taskfileid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskFiles" ALTER COLUMN taskfileid SET DEFAULT nextval('public."TaskFiles_taskfileid_seq"'::regclass);


--
-- TOC entry 3410 (class 2604 OID 16754)
-- Name: TaskSubmissionFile tasksubmissionfileid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskSubmissionFile" ALTER COLUMN tasksubmissionfileid SET DEFAULT nextval('public."TaskSubmissionFile_tasksubmissionfileid_seq"'::regclass);


--
-- TOC entry 3403 (class 2604 OID 16725)
-- Name: TaskUser taskuserid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskUser" ALTER COLUMN taskuserid SET DEFAULT nextval('public."TaskUser_taskuserid_seq"'::regclass);


--
-- TOC entry 3364 (class 2604 OID 16390)
-- Name: User userid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User" ALTER COLUMN userid SET DEFAULT nextval('public."User_userid_seq"'::regclass);


--
-- TOC entry 3391 (class 2604 OID 16493)
-- Name: university uniid; Type: DEFAULT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public.university ALTER COLUMN uniid SET DEFAULT nextval('public.university_uniid_seq'::regclass);


--
-- TOC entry 3660 (class 0 OID 16426)
-- Dependencies: 213
-- Data for Name: AcademicStaff; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."AcademicStaff" (userid, email, salt, password, name, dob, matricnumber, institution, profilepic, staffid, iscoordinator, issupervisor, isstaff, isstudent, pastduetasks, redtasks, yellowtasks, shamepoints, verified, verificationkey) FROM stdin;
\.


--
-- TOC entry 3666 (class 0 OID 16585)
-- Dependencies: 219
-- Data for Name: Batch; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Batch" (batchid, batchname, batchyear, batchstatus, batchhead) FROM stdin;
\.


--
-- TOC entry 3668 (class 0 OID 16601)
-- Dependencies: 221
-- Data for Name: BatchDocumentation; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."BatchDocumentation" (batchdocumentationid, batchid, documentationtitle, batchdocumentation) FROM stdin;
\.


--
-- TOC entry 3695 (class 0 OID 17160)
-- Dependencies: 248
-- Data for Name: BatchSupervisor; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."BatchSupervisor" (supervisorid, batchid, batchsupervisorid) FROM stdin;
\.


--
-- TOC entry 3700 (class 0 OID 17375)
-- Dependencies: 253
-- Data for Name: BetaTester; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."BetaTester" (email, sentlink) FROM stdin;
\.


--
-- TOC entry 3690 (class 0 OID 16971)
-- Dependencies: 243
-- Data for Name: Complaint; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Complaint" (complaintid, studentid, complainttitle, complainttext, complaintstatus, complaintnotification, complaintdate) FROM stdin;
\.


--
-- TOC entry 3692 (class 0 OID 16985)
-- Dependencies: 245
-- Data for Name: ComplaintFile; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."ComplaintFile" (complaintfileid, complaintid, complaintfilename, complaintfiletype, complaintfiletitle) FROM stdin;
\.


--
-- TOC entry 3694 (class 0 OID 17002)
-- Dependencies: 247
-- Data for Name: ComplaintReply; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."ComplaintReply" (complaintreplyid, complaintid, userid, complaintreplytext, complaintreplydate) FROM stdin;
\.


--
-- TOC entry 3682 (class 0 OID 16763)
-- Dependencies: 235
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Event" (eventid, eventtitle, eventdescription, eventdate, eventtime, gmapembed, eventimage, eventhead, batch) FROM stdin;
\.


--
-- TOC entry 3698 (class 0 OID 17199)
-- Dependencies: 251
-- Data for Name: EventBatch; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."EventBatch" (eventbatchid, eventid, batchid) FROM stdin;
\.


--
-- TOC entry 3686 (class 0 OID 16796)
-- Dependencies: 239
-- Data for Name: EventFiles; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."EventFiles" (eventfileid, eventid, eventfile, eventfilename, filetype) FROM stdin;
\.


--
-- TOC entry 3688 (class 0 OID 16808)
-- Dependencies: 241
-- Data for Name: EventSpeaker; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."EventSpeaker" (eventspeakerid, eventid, eventspeaker, eventspeakerimage, eventspeakerbio, eventspeakercontact) FROM stdin;
\.


--
-- TOC entry 3684 (class 0 OID 16778)
-- Dependencies: 237
-- Data for Name: EventUser; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."EventUser" (eventuserid, eventid, assignedto, attended) FROM stdin;
\.


--
-- TOC entry 3670 (class 0 OID 16613)
-- Dependencies: 223
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Project" (projectid, projecttitle, projectdescription, approvalstatus, projecttype, projectimage, supervisorid, batchid, intromarkdown, recruitment) FROM stdin;
\.


--
-- TOC entry 3699 (class 0 OID 17366)
-- Dependencies: 252
-- Data for Name: ProjectBin; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."ProjectBin" (projectid, projecttitle, projectdescription, approvalstatus, projecttype, projectimage, supervisorid, batchid, intromarkdown, recruitment, "onDeletionKey") FROM stdin;
\.


--
-- TOC entry 3672 (class 0 OID 16688)
-- Dependencies: 225
-- Data for Name: ProjectStudent; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."ProjectStudent" (requestid, projectid, studentid, requeststatus) FROM stdin;
\.


--
-- TOC entry 3662 (class 0 OID 16443)
-- Dependencies: 215
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Student" (userid, email, salt, password, name, dob, matricnumber, institution, profilepic, studentid, batchid, isstaff, isstudent, pastduetasks, redtasks, yellowtasks, shamepoints, verified, verificationkey) FROM stdin;
\.


--
-- TOC entry 3702 (class 0 OID 17445)
-- Dependencies: 255
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Tag" (tagid, tagname, tagcount) FROM stdin;
\.


--
-- TOC entry 3674 (class 0 OID 16706)
-- Dependencies: 227
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."Task" (taskid, tasktitle, taskdescription, duedate, yellowzone, redzone, lock, assignedfrom, batchid) FROM stdin;
\.


--
-- TOC entry 3678 (class 0 OID 16739)
-- Dependencies: 231
-- Data for Name: TaskFiles; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."TaskFiles" (taskfileid, taskid, taskfile, taskfilename, filetype) FROM stdin;
\.


--
-- TOC entry 3680 (class 0 OID 16751)
-- Dependencies: 233
-- Data for Name: TaskSubmissionFile; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."TaskSubmissionFile" (tasksubmissionfileid, taskid, tasksubmissionfile, userid, typeoffile, filename) FROM stdin;
\.


--
-- TOC entry 3676 (class 0 OID 16722)
-- Dependencies: 229
-- Data for Name: TaskUser; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."TaskUser" (taskuserid, taskid, userid, submissionstatus, isyellowshamed, isredshamed, isblackshamed) FROM stdin;
\.


--
-- TOC entry 3658 (class 0 OID 16387)
-- Dependencies: 211
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public."User" (userid, email, salt, password, name, dob, matricnumber, institution, profilepic, isstaff, isstudent, pastduetasks, redtasks, yellowtasks, shamepoints, verified, verificationkey) FROM stdin;
\.


--
-- TOC entry 3664 (class 0 OID 16490)
-- Dependencies: 217
-- Data for Name: university; Type: TABLE DATA; Schema: public; Owner: kale
--

COPY public.university (uniid, uniname, typeofuni) FROM stdin;
1	Universiti Utara Malaysia	Public
\.


--
-- TOC entry 3732 (class 0 OID 0)
-- Dependencies: 212
-- Name: AcademicStaff_staffid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."AcademicStaff_staffid_seq"', 31, true);


--
-- TOC entry 3733 (class 0 OID 0)
-- Dependencies: 220
-- Name: BatchDocumentation_batchdocumentationid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."BatchDocumentation_batchdocumentationid_seq"', 7, true);


--
-- TOC entry 3734 (class 0 OID 0)
-- Dependencies: 249
-- Name: BatchSupervisor_batchsupervisorid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."BatchSupervisor_batchsupervisorid_seq"', 4, true);


--
-- TOC entry 3735 (class 0 OID 0)
-- Dependencies: 218
-- Name: Batch_batchid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Batch_batchid_seq"', 15, true);


--
-- TOC entry 3736 (class 0 OID 0)
-- Dependencies: 244
-- Name: ComplaintFile_complaintfileid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."ComplaintFile_complaintfileid_seq"', 2, true);


--
-- TOC entry 3737 (class 0 OID 0)
-- Dependencies: 246
-- Name: ComplaintReply_complaintreplyid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."ComplaintReply_complaintreplyid_seq"', 24, true);


--
-- TOC entry 3738 (class 0 OID 0)
-- Dependencies: 242
-- Name: Complaint_complaintid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Complaint_complaintid_seq"', 39, true);


--
-- TOC entry 3739 (class 0 OID 0)
-- Dependencies: 250
-- Name: EventBatch_eventbatchid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."EventBatch_eventbatchid_seq"', 1, true);


--
-- TOC entry 3740 (class 0 OID 0)
-- Dependencies: 238
-- Name: EventFiles_eventfileid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."EventFiles_eventfileid_seq"', 13, true);


--
-- TOC entry 3741 (class 0 OID 0)
-- Dependencies: 240
-- Name: EventSpeaker_eventspeakerid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."EventSpeaker_eventspeakerid_seq"', 30, true);


--
-- TOC entry 3742 (class 0 OID 0)
-- Dependencies: 236
-- Name: EventUser_eventuserid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."EventUser_eventuserid_seq"', 74, true);


--
-- TOC entry 3743 (class 0 OID 0)
-- Dependencies: 234
-- Name: Event_eventid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Event_eventid_seq"', 37, true);


--
-- TOC entry 3744 (class 0 OID 0)
-- Dependencies: 222
-- Name: Project_projectid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Project_projectid_seq"', 23, true);


--
-- TOC entry 3745 (class 0 OID 0)
-- Dependencies: 224
-- Name: RequestToUndertakeProject_requestid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."RequestToUndertakeProject_requestid_seq"', 43, true);


--
-- TOC entry 3746 (class 0 OID 0)
-- Dependencies: 214
-- Name: Student_studentid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Student_studentid_seq"', 143, true);


--
-- TOC entry 3747 (class 0 OID 0)
-- Dependencies: 254
-- Name: Tag_tagid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Tag_tagid_seq"', 1, false);


--
-- TOC entry 3748 (class 0 OID 0)
-- Dependencies: 230
-- Name: TaskFiles_taskfileid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."TaskFiles_taskfileid_seq"', 9, true);


--
-- TOC entry 3749 (class 0 OID 0)
-- Dependencies: 232
-- Name: TaskSubmissionFile_tasksubmissionfileid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."TaskSubmissionFile_tasksubmissionfileid_seq"', 13, true);


--
-- TOC entry 3750 (class 0 OID 0)
-- Dependencies: 228
-- Name: TaskUser_taskuserid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."TaskUser_taskuserid_seq"', 118, true);


--
-- TOC entry 3751 (class 0 OID 0)
-- Dependencies: 226
-- Name: Task_taskid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."Task_taskid_seq"', 119, true);


--
-- TOC entry 3752 (class 0 OID 0)
-- Dependencies: 210
-- Name: User_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public."User_userid_seq"', 174, true);


--
-- TOC entry 3753 (class 0 OID 0)
-- Dependencies: 216
-- Name: university_uniid_seq; Type: SEQUENCE SET; Schema: public; Owner: kale
--

SELECT pg_catalog.setval('public.university_uniid_seq', 1, false);


--
-- TOC entry 3445 (class 2606 OID 16436)
-- Name: AcademicStaff AcademicStaff_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."AcademicStaff"
    ADD CONSTRAINT "AcademicStaff_pkey" PRIMARY KEY (staffid);


--
-- TOC entry 3453 (class 2606 OID 16606)
-- Name: BatchDocumentation BatchDocumentation_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchDocumentation"
    ADD CONSTRAINT "BatchDocumentation_pkey" PRIMARY KEY (batchdocumentationid);


--
-- TOC entry 3481 (class 2606 OID 17187)
-- Name: BatchSupervisor BatchSupervisor_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchSupervisor"
    ADD CONSTRAINT "BatchSupervisor_pkey" PRIMARY KEY (batchsupervisorid);


--
-- TOC entry 3451 (class 2606 OID 16594)
-- Name: Batch Batch_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Batch"
    ADD CONSTRAINT "Batch_pkey" PRIMARY KEY (batchid);


--
-- TOC entry 3477 (class 2606 OID 16990)
-- Name: ComplaintFile ComplaintFile_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ComplaintFile"
    ADD CONSTRAINT "ComplaintFile_pkey" PRIMARY KEY (complaintfileid);


--
-- TOC entry 3479 (class 2606 OID 17009)
-- Name: ComplaintReply ComplaintReply_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ComplaintReply"
    ADD CONSTRAINT "ComplaintReply_pkey" PRIMARY KEY (complaintreplyid);


--
-- TOC entry 3475 (class 2606 OID 16978)
-- Name: Complaint Complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Complaint"
    ADD CONSTRAINT "Complaint_pkey" PRIMARY KEY (complaintid);


--
-- TOC entry 3483 (class 2606 OID 17204)
-- Name: EventBatch EventBatch_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventBatch"
    ADD CONSTRAINT "EventBatch_pkey" PRIMARY KEY (eventbatchid);


--
-- TOC entry 3471 (class 2606 OID 16801)
-- Name: EventFiles EventFiles_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventFiles"
    ADD CONSTRAINT "EventFiles_pkey" PRIMARY KEY (eventfileid);


--
-- TOC entry 3473 (class 2606 OID 16816)
-- Name: EventSpeaker EventSpeaker_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventSpeaker"
    ADD CONSTRAINT "EventSpeaker_pkey" PRIMARY KEY (eventspeakerid);


--
-- TOC entry 3469 (class 2606 OID 16783)
-- Name: EventUser EventUser_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventUser"
    ADD CONSTRAINT "EventUser_pkey" PRIMARY KEY (eventuserid);


--
-- TOC entry 3467 (class 2606 OID 16771)
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (eventid);


--
-- TOC entry 3455 (class 2606 OID 16622)
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (projectid);


--
-- TOC entry 3457 (class 2606 OID 16694)
-- Name: ProjectStudent RequestToUndertakeProject_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ProjectStudent"
    ADD CONSTRAINT "RequestToUndertakeProject_pkey" PRIMARY KEY (requestid);


--
-- TOC entry 3447 (class 2606 OID 16453)
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (studentid);


--
-- TOC entry 3485 (class 2606 OID 17451)
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (tagid);


--
-- TOC entry 3463 (class 2606 OID 16744)
-- Name: TaskFiles TaskFiles_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskFiles"
    ADD CONSTRAINT "TaskFiles_pkey" PRIMARY KEY (taskfileid);


--
-- TOC entry 3465 (class 2606 OID 16756)
-- Name: TaskSubmissionFile TaskSubmissionFile_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskSubmissionFile"
    ADD CONSTRAINT "TaskSubmissionFile_pkey" PRIMARY KEY (tasksubmissionfileid);


--
-- TOC entry 3461 (class 2606 OID 16727)
-- Name: TaskUser TaskUser_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskUser"
    ADD CONSTRAINT "TaskUser_pkey" PRIMARY KEY (taskuserid);


--
-- TOC entry 3459 (class 2606 OID 16715)
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (taskid);


--
-- TOC entry 3435 (class 2606 OID 16398)
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- TOC entry 3437 (class 2606 OID 16460)
-- Name: User User_matricnumber_key; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_matricnumber_key" UNIQUE (matricnumber);


--
-- TOC entry 3439 (class 2606 OID 16396)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (userid);


--
-- TOC entry 3394 (class 2606 OID 17365)
-- Name: Batch check_status; Type: CHECK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE public."Batch"
    ADD CONSTRAINT check_status CHECK (((batchstatus)::text ~~* ANY (ARRAY['Preparation'::text, 'Finished'::text, 'Undergoing'::text]))) NOT VALID;


--
-- TOC entry 3441 (class 2606 OID 16462)
-- Name: User matricnumber; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT matricnumber UNIQUE (matricnumber);


--
-- TOC entry 3443 (class 2606 OID 16499)
-- Name: User unique_email; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- TOC entry 3449 (class 2606 OID 16497)
-- Name: university university_pkey; Type: CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public.university
    ADD CONSTRAINT university_pkey PRIMARY KEY (uniid);


--
-- TOC entry 3513 (class 2620 OID 17229)
-- Name: Project backup_deleted_row; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER backup_deleted_row BEFORE DELETE ON public."Project" FOR EACH ROW EXECUTE FUNCTION public.backup_deleted_row();


--
-- TOC entry 3515 (class 2620 OID 17286)
-- Name: ProjectStudent delete_false_requests_trigger; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER delete_false_requests_trigger AFTER UPDATE ON public."ProjectStudent" FOR EACH ROW EXECUTE FUNCTION public.delete_false_requests();


--
-- TOC entry 3517 (class 2620 OID 17358)
-- Name: Complaint prevent_status_change; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER prevent_status_change BEFORE UPDATE ON public."Complaint" FOR EACH ROW EXECUTE FUNCTION public.prevent_status_change();


--
-- TOC entry 3511 (class 2620 OID 17383)
-- Name: AcademicStaff trg_new_academic_staff; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER trg_new_academic_staff AFTER INSERT ON public."AcademicStaff" FOR EACH ROW EXECUTE FUNCTION public.trg_new_user_func();


--
-- TOC entry 3512 (class 2620 OID 17384)
-- Name: Student trg_new_student; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER trg_new_student AFTER INSERT ON public."Student" FOR EACH ROW EXECUTE FUNCTION public.trg_new_user_func();


--
-- TOC entry 3510 (class 2620 OID 17382)
-- Name: User trg_new_user; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER trg_new_user AFTER INSERT ON public."User" FOR EACH ROW EXECUTE FUNCTION public.trg_new_user_func();


--
-- TOC entry 3516 (class 2620 OID 17352)
-- Name: TaskUser update_shamepoints_trigger; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER update_shamepoints_trigger AFTER UPDATE OF submissionstatus ON public."TaskUser" FOR EACH ROW EXECUTE FUNCTION public.update_shamepoints();


--
-- TOC entry 3514 (class 2620 OID 16939)
-- Name: Project update_tag; Type: TRIGGER; Schema: public; Owner: kale
--

CREATE TRIGGER update_tag AFTER INSERT ON public."Project" FOR EACH ROW EXECUTE FUNCTION public.update_tag();


--
-- TOC entry 3488 (class 2606 OID 16607)
-- Name: BatchDocumentation BatchDocumentation_batchid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchDocumentation"
    ADD CONSTRAINT "BatchDocumentation_batchid_fkey" FOREIGN KEY (batchid) REFERENCES public."Batch"(batchid);


--
-- TOC entry 3506 (class 2606 OID 17166)
-- Name: BatchSupervisor BatchSupervisor_academicstaff_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchSupervisor"
    ADD CONSTRAINT "BatchSupervisor_academicstaff_fkey" FOREIGN KEY (supervisorid) REFERENCES public."AcademicStaff"(staffid) NOT VALID;


--
-- TOC entry 3507 (class 2606 OID 17171)
-- Name: BatchSupervisor BatchSupervisor_batchid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."BatchSupervisor"
    ADD CONSTRAINT "BatchSupervisor_batchid_fkey" FOREIGN KEY (batchid) REFERENCES public."Batch"(batchid) NOT VALID;


--
-- TOC entry 3487 (class 2606 OID 16595)
-- Name: Batch Batch_batchhead_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Batch"
    ADD CONSTRAINT "Batch_batchhead_fkey" FOREIGN KEY (batchhead) REFERENCES public."AcademicStaff"(staffid);


--
-- TOC entry 3504 (class 2606 OID 16991)
-- Name: ComplaintFile ComplaintFile_complaintid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ComplaintFile"
    ADD CONSTRAINT "ComplaintFile_complaintid_fkey" FOREIGN KEY (complaintid) REFERENCES public."Complaint"(complaintid);


--
-- TOC entry 3505 (class 2606 OID 17010)
-- Name: ComplaintReply ComplaintReply_complaintid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ComplaintReply"
    ADD CONSTRAINT "ComplaintReply_complaintid_fkey" FOREIGN KEY (complaintid) REFERENCES public."Complaint"(complaintid);


--
-- TOC entry 3503 (class 2606 OID 16979)
-- Name: Complaint Complaint_studentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Complaint"
    ADD CONSTRAINT "Complaint_studentid_fkey" FOREIGN KEY (studentid) REFERENCES public."Student"(studentid);


--
-- TOC entry 3501 (class 2606 OID 16802)
-- Name: EventFiles EventFiles_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventFiles"
    ADD CONSTRAINT "EventFiles_eventid_fkey" FOREIGN KEY (eventid) REFERENCES public."Event"(eventid);


--
-- TOC entry 3502 (class 2606 OID 16817)
-- Name: EventSpeaker EventSpeaker_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventSpeaker"
    ADD CONSTRAINT "EventSpeaker_eventid_fkey" FOREIGN KEY (eventid) REFERENCES public."Event"(eventid);


--
-- TOC entry 3500 (class 2606 OID 16784)
-- Name: EventUser EventUser_eventid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventUser"
    ADD CONSTRAINT "EventUser_eventid_fkey" FOREIGN KEY (eventid) REFERENCES public."Event"(eventid);


--
-- TOC entry 3499 (class 2606 OID 17253)
-- Name: Event Event_batch_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_batch_fkey" FOREIGN KEY (batch) REFERENCES public."Batch"(batchid) NOT VALID;


--
-- TOC entry 3498 (class 2606 OID 16772)
-- Name: Event Event_eventhead_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_eventhead_fkey" FOREIGN KEY (eventhead) REFERENCES public."AcademicStaff"(staffid);


--
-- TOC entry 3490 (class 2606 OID 16628)
-- Name: Project Project_batchid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_batchid_fkey" FOREIGN KEY (batchid) REFERENCES public."Batch"(batchid);


--
-- TOC entry 3489 (class 2606 OID 16623)
-- Name: Project Project_supervisorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_supervisorid_fkey" FOREIGN KEY (supervisorid) REFERENCES public."AcademicStaff"(staffid);


--
-- TOC entry 3491 (class 2606 OID 16695)
-- Name: ProjectStudent RequestToUndertakeProject_projectid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ProjectStudent"
    ADD CONSTRAINT "RequestToUndertakeProject_projectid_fkey" FOREIGN KEY (projectid) REFERENCES public."Project"(projectid);


--
-- TOC entry 3492 (class 2606 OID 16700)
-- Name: ProjectStudent RequestToUndertakeProject_studentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."ProjectStudent"
    ADD CONSTRAINT "RequestToUndertakeProject_studentid_fkey" FOREIGN KEY (studentid) REFERENCES public."Student"(studentid);


--
-- TOC entry 3496 (class 2606 OID 16745)
-- Name: TaskFiles TaskFiles_taskid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskFiles"
    ADD CONSTRAINT "TaskFiles_taskid_fkey" FOREIGN KEY (taskid) REFERENCES public."Task"(taskid);


--
-- TOC entry 3497 (class 2606 OID 16757)
-- Name: TaskSubmissionFile TaskSubmissionFile_taskid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskSubmissionFile"
    ADD CONSTRAINT "TaskSubmissionFile_taskid_fkey" FOREIGN KEY (taskid) REFERENCES public."Task"(taskid);


--
-- TOC entry 3495 (class 2606 OID 16728)
-- Name: TaskUser TaskUser_taskid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."TaskUser"
    ADD CONSTRAINT "TaskUser_taskid_fkey" FOREIGN KEY (taskid) REFERENCES public."Task"(taskid);


--
-- TOC entry 3493 (class 2606 OID 16716)
-- Name: Task Task_assignedfrom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_assignedfrom_fkey" FOREIGN KEY (assignedfrom) REFERENCES public."AcademicStaff"(staffid);


--
-- TOC entry 3494 (class 2606 OID 17193)
-- Name: Task Task_batch_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_batch_fkey" FOREIGN KEY (batchid) REFERENCES public."Batch"(batchid) NOT VALID;


--
-- TOC entry 3509 (class 2606 OID 17215)
-- Name: EventBatch fk_eventbatch_batchid; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventBatch"
    ADD CONSTRAINT fk_eventbatch_batchid FOREIGN KEY (batchid) REFERENCES public."Batch"(batchid) NOT VALID;


--
-- TOC entry 3508 (class 2606 OID 17210)
-- Name: EventBatch fk_eventbatch_eventid; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."EventBatch"
    ADD CONSTRAINT fk_eventbatch_eventid FOREIGN KEY (eventid) REFERENCES public."Event"(eventid) NOT VALID;


--
-- TOC entry 3486 (class 2606 OID 16828)
-- Name: Student student_batch_fk; Type: FK CONSTRAINT; Schema: public; Owner: kale
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT student_batch_fk FOREIGN KEY (batchid) REFERENCES public."Batch"(batchid);


--
-- TOC entry 3714 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE "BetaTester"; Type: ACL; Schema: public; Owner: kale
--

GRANT ALL ON TABLE public."BetaTester" TO pg_database_owner;


-- Completed on 2024-06-19 01:21:47 +08

--
-- PostgreSQL database dump complete
--

