-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2025 at 05:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `monitoring_license`
--

-- --------------------------------------------------------

--
-- Table structure for table `lisensya_table`
--

CREATE TABLE `lisensya_table` (
  `user_id` int(11) NOT NULL,
  `username` varchar(244) NOT NULL,
  `password` varchar(244) NOT NULL,
  `name` varchar(244) DEFAULT NULL,
  `role` varchar(244) DEFAULT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lisensya_table`
--

INSERT INTO `lisensya_table` (`user_id`, `username`, `password`, `name`, `role`, `email`) VALUES
(1, 'admin', 'admin', 'admin', 'Admin', ''),
(57, 'Lapulapu', '12345', 'Magellan', 'IT', ''),
(58, 'Jerick', '12345', 'Jerick Perez', 'User', ''),
(59, 'Gian', '12345', 'Gian Philip', 'User', 'ertertreteter@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `renewal_table`
--

CREATE TABLE `renewal_table` (
  `item_no` int(100) NOT NULL,
  `username` varchar(255) NOT NULL,
  `category` varchar(244) NOT NULL,
  `type` varchar(244) NOT NULL,
  `validity` date NOT NULL,
  `renewal_type` varchar(244) NOT NULL,
  `product` varchar(244) NOT NULL,
  `description` text NOT NULL,
  `supplier` varchar(244) NOT NULL,
  `sales_contact` varchar(244) NOT NULL,
  `email` varchar(244) NOT NULL,
  `price` varchar(244) NOT NULL,
  `remarks` text NOT NULL,
  `quotation` varchar(244) NOT NULL,
  `expiry_notified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renewal_table`
--

INSERT INTO `renewal_table` (`item_no`, `username`, `category`, `type`, `validity`, `renewal_type`, `product`, `description`, `supplier`, `sales_contact`, `email`, `price`, `remarks`, `quotation`, `expiry_notified`) VALUES
(40, 'admin', 'WEQRQWEWQ', 'qweqweqewq', '2025-11-02', '1 Year', 'werwerw', 'werwerew', 'werwerwerwe', 'werweewrwe', 'QWEWQEWQE@gmail.com', '32424', 'werwer', '', 0),
(41, 'admin', 'qweqweqe', 'qweqweqewq', '2025-11-05', '1 Year', 'werwerw', 'ewrwerwer', 'werwerwr', 'werwerewrw', 'QWEWQEWQE@gmail.com', '324234', 'ewrwerwre', '', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lisensya_table`
--
ALTER TABLE `lisensya_table`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `renewal_table`
--
ALTER TABLE `renewal_table`
  ADD PRIMARY KEY (`item_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lisensya_table`
--
ALTER TABLE `lisensya_table`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `renewal_table`
--
ALTER TABLE `renewal_table`
  MODIFY `item_no` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
