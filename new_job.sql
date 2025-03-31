-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: new
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `job`
--

DROP TABLE IF EXISTS `job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job` (
  `Job_ID` int NOT NULL AUTO_INCREMENT,
  `Emp_ID` int NOT NULL,
  `Salary` decimal(10,2) NOT NULL,
  `Description` text NOT NULL,
  `Locations` varchar(255) NOT NULL,
  `Type` enum('Full-Time','Part-Time','Contract','Internship') NOT NULL,
  `TimeOfPosting` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `No_Apps` int DEFAULT '0',
  `Status` enum('Open','Closed') NOT NULL DEFAULT 'Open',
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Job_ID`),
  KEY `Emp_ID` (`Emp_ID`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`Emp_ID`) REFERENCES `employer` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job`
--

LOCK TABLES `job` WRITE;
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
INSERT INTO `job` VALUES (5,16,2000.00,'IT job, flexible timings, work from home','Kochi','Part-Time','2025-03-23 04:56:38',0,'Open','IT Job'),(6,16,70000.00,'Remote it consultant required, work from home offered','Kozhikode','Full-Time','2025-03-23 10:21:55',0,'Open','IT Consultant'),(7,16,45000.00,'web development with AI integration ','Malappuram','Part-Time','2025-03-23 10:23:18',0,'Open','Database Developer'),(8,16,30000.00,'Database development ','Mumbai','Contract','2025-03-23 10:24:52',0,'Open',NULL),(9,17,23.00,'12','12','Full-Time','2025-03-26 15:42:01',0,'Open','12'),(14,16,23.00,'ger','rtq','Full-Time','2025-03-30 13:23:24',0,'Open','tie'),(15,16,23.00,'ger','rtq','Full-Time','2025-03-30 13:23:25',0,'Open','tie');
/*!40000 ALTER TABLE `job` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31 13:25:43
