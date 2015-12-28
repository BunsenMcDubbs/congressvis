CREATE DATABASE  IF NOT EXISTS `congressvis` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `congressvis`;
-- MySQL dump 10.13  Distrib 5.7.9, for osx10.9 (x86_64)
--
-- Host: localhost    Database: congressvis
-- ------------------------------------------------------
-- Server version	5.7.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bill_sponsors`
--

DROP TABLE IF EXISTS `bill_sponsors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bill_sponsors` (
  `idbill_sponsor` int(11) NOT NULL AUTO_INCREMENT,
  `member_thomas_id` varchar(20) NOT NULL,
  `bill_id` varchar(20) NOT NULL,
  `sponsored_at` datetime NOT NULL,
  `withdrawn_at` datetime DEFAULT NULL,
  `primary_sponsor` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idbill_sponsor`),
  KEY `bill_id_idx` (`bill_id`),
  KEY `member_thomas_id_idx` (`member_thomas_id`),
  CONSTRAINT `bill_sponsor_bill_id_fk` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thomas_id_fk` FOREIGN KEY (`member_thomas_id`) REFERENCES `members` (`thomas_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bill_subjects`
--

DROP TABLE IF EXISTS `bill_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bill_subjects` (
  `bill_subjects_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `bill_id` varchar(20) NOT NULL,
  PRIMARY KEY (`bill_subjects_id`),
  KEY `bill_id_fk_idx` (`bill_id`),
  KEY `subject_id_fk_idx` (`subject_id`),
  CONSTRAINT `bill_id_fk` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `subject_id_fk` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bill_versions`
--

DROP TABLE IF EXISTS `bill_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bill_versions` (
  `bill_version_id` varchar(25) NOT NULL,
  `issued_on` datetime NOT NULL,
  `version_code` varchar(10) NOT NULL,
  `bill_id` varchar(20) NOT NULL,
  PRIMARY KEY (`bill_version_id`),
  KEY `bill_id_idx` (`bill_id`),
  CONSTRAINT `bill_id` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bills` (
  `bill_id` varchar(20) NOT NULL,
  `bill_type` varchar(10) NOT NULL,
  `congress` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `official_title` varchar(2000) NOT NULL,
  `popular_title` varchar(1000) DEFAULT NULL,
  `short_title` varchar(500) DEFAULT NULL,
  `introduced_at` datetime NOT NULL,
  `active` tinyint(1) NOT NULL,
  `vetoed` tinyint(1) NOT NULL,
  `enacted` tinyint(1) NOT NULL,
  `awaiting_signature` tinyint(1) NOT NULL,
  `status` varchar(45) NOT NULL,
  `status_at` datetime NOT NULL,
  `sponsor_thomas_id` varchar(20) NOT NULL,
  `subject_top_term_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`bill_id`),
  UNIQUE KEY `bill_id_UNIQUE` (`bill_id`),
  KEY `sponsor_thomas_id_fk` (`sponsor_thomas_id`),
  KEY `congress_fk_idx` (`congress`),
  KEY `subject_top_term_id_fk_idx` (`subject_top_term_id`),
  CONSTRAINT `congress_fk` FOREIGN KEY (`congress`) REFERENCES `congresses` (`congress_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sponsor_thomas_id_fk` FOREIGN KEY (`sponsor_thomas_id`) REFERENCES `members` (`thomas_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `subject_top_term_id_fk` FOREIGN KEY (`subject_top_term_id`) REFERENCES `subjects` (`subject_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `congresses`
--

DROP TABLE IF EXISTS `congresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `congresses` (
  `congress_id` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  PRIMARY KEY (`congress_id`),
  KEY `congress_start_idx` (`start`),
  KEY `congress_end_idx` (`end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `member_congresses`
--

DROP TABLE IF EXISTS `member_congresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_congresses` (
  `idmember_congress` int(11) NOT NULL AUTO_INCREMENT,
  `member_bioguide_id` varchar(20) NOT NULL,
  `congress_id` int(11) NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idmember_congress`),
  KEY `members_by_congress_idx` (`congress_id`),
  KEY `congress_by_member_idx` (`member_bioguide_id`),
  KEY `member_congress_term_id_fk_idx` (`term_id`),
  CONSTRAINT `member_congress_bioguide_id_fk` FOREIGN KEY (`member_bioguide_id`) REFERENCES `members` (`bioguide_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `member_congress_congress_id_fk` FOREIGN KEY (`congress_id`) REFERENCES `congresses` (`congress_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `member_congress_term_id_fk` FOREIGN KEY (`term_id`) REFERENCES `terms` (`term_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `member_votes`
--

DROP TABLE IF EXISTS `member_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_votes` (
  `member_vote_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_bioguide_id` varchar(20) NOT NULL,
  `vote_id` varchar(20) NOT NULL,
  `vote` enum('+','-','0') NOT NULL,
  `party` varchar(5) DEFAULT NULL,
  `state` varchar(2) NOT NULL,
  `display_as` varchar(45) NOT NULL,
  PRIMARY KEY (`member_vote_id`),
  KEY `vote_id_idx` (`vote_id`),
  KEY `bioguide_id_idx` (`member_bioguide_id`),
  CONSTRAINT `bioguide_id_fk` FOREIGN KEY (`member_bioguide_id`) REFERENCES `members` (`bioguide_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `vote_id_fk` FOREIGN KEY (`vote_id`) REFERENCES `votes` (`vote_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `bioguide_id` varchar(20) NOT NULL,
  `govtrack_id` varchar(20) NOT NULL,
  `thomas_id` varchar(20) DEFAULT NULL,
  `lis_id` varchar(5) DEFAULT NULL COMMENT 'Only for senators (votes marked by this id)',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `name` varchar(100) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) VIRTUAL,
  `gender` enum('M','F','O') DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  PRIMARY KEY (`bioguide_id`),
  UNIQUE KEY `bioguide_id_UNIQUE` (`bioguide_id`),
  UNIQUE KEY `govtrack_id_UNIQUE` (`govtrack_id`),
  UNIQUE KEY `thomas_id_UNIQUE` (`thomas_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(150) DEFAULT NULL,
  `subject_top_term` varchar(150) NOT NULL,
  PRIMARY KEY (`subject_id`),
  KEY `subject_top_term` (`subject_top_term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `terms`
--

DROP TABLE IF EXISTS `terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `terms` (
  `term_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `member_bioguide_id` varchar(20) NOT NULL,
  `state` char(2) NOT NULL,
  `district` tinyint(2) DEFAULT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `party` varchar(45) DEFAULT NULL,
  `type` enum('rep','sen') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `contact_form` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`term_id`),
  UNIQUE KEY `term_id_UNIQUE` (`term_id`),
  KEY `state_district_INDEX` (`state`,`district`),
  KEY `type_party_INDEX` (`type`,`party`),
  KEY `member_bioguide_id_fk` (`member_bioguide_id`),
  CONSTRAINT `member_bioguide_id_fk` FOREIGN KEY (`member_bioguide_id`) REFERENCES `members` (`bioguide_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `congressvis`.`term_AFTER_INSERT`
AFTER INSERT ON `terms` FOR EACH ROW
BEGIN
	declare done int default false;
	declare fetched_congress_id INT;
	declare congress_query cursor for select `congress_id` from `congresses` where `congresses`.`start` < NEW.end and `congresses`.`end` > NEW.start;
	declare continue handler for not found set done = 1;

    open congress_query;

    find_congresses: loop
		fetch congress_query into fetched_congress_id;
        if done then
			leave find_congresses;
		end if;
        insert into `member_congresses` (`member_bioguide_id`, `congress_id`, `term_id`) VALUES(NEW.`member_bioguide_id`, fetched_congress_id, NEW.`term_id`);
    end loop;

    close congress_query;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `vote_id` varchar(20) NOT NULL,
  `bill_id` varchar(45) NOT NULL,
  `date` datetime NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `result` varchar(45) DEFAULT NULL,
  `question` text,
  `subject` text,
  PRIMARY KEY (`vote_id`),
  KEY `vote_bill_id_idx` (`bill_id`),
  CONSTRAINT `vote_bill_id_fk` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'congressvis'
--

--
-- Dumping routines for database 'congressvis'
--
/*!50003 DROP PROCEDURE IF EXISTS `getCongressById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCongressById`(IN `@input_congress` INT)
BEGIN
DECLARE `@selected_congress` INT;
IF `@input_congress` IS NOT NULL THEN
	SET `@selected_congress` = `@input_congress`;
    SELECT
			`congresses`.`congress_id` AS `congress_id`,
            `congresses`.`start` AS `start`,
            `congresses`.`end` AS `end`,
            COUNT(`member_congresses`.`member_bioguide_id`) AS `num_members`
		FROM (`congresses`
			INNER JOIN `member_congresses` ON (`member_congresses`.`congress_id` = `congresses`.`congress_id`))
		WHERE `congresses`.`congress_id` = `@selected_congress`
        GROUP BY `congresses`.`congress_id`;
ELSE
    SELECT
			`congresses`.`congress_id` AS `congress_id`,
            `congresses`.`start` AS `start`,
            `congresses`.`end` AS `end`,
            COUNT(`member_congresses`.`member_bioguide_id`) AS `num_members`
		FROM (`congresses`
			INNER JOIN `member_congresses` ON (`member_congresses`.`congress_id` = `congresses`.`congress_id`))
		GROUP BY `congresses`.`congress_id`;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getCongressMembers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCongressMembers`(IN `@input_congress` INT)
BEGIN
DECLARE `@selected_congress` INT;
SET `@selected_congress` = `@input_congress`;
SELECT
        `members`.`bioguide_id` AS `bioguide_id`,
        `members`.`govtrack_id` AS `govtrack_id`,
        `members`.`thomas_id` AS `thomas_id`,
        `members`.`lis_id` AS `lis_id`,
        `members`.`first_name` AS `first_name`,
        `members`.`last_name` AS `last_name`,
        `members`.`name` AS `name`,
        `terms`.`party` AS `party`,
        `terms`.`type` AS `type`,
        `terms`.`state` AS `state`,
        `terms`.`district` AS `district`,
        `member_congresses`.`congress_id` AS `congress`
	FROM
		((`members`
		JOIN `member_congresses` ON ((`members`.`bioguide_id` = `member_congresses`.`member_bioguide_id`)))
		JOIN `terms` ON ((`terms`.`term_id` = `member_congresses`.`term_id`)))
	WHERE `member_congresses`.`congress_id` = `@selected_congress`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-27 19:30:04
