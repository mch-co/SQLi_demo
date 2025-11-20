-- Script de configuration de la base de données pour la démo SQLi

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS sqli_demo;
USE sqli_demo;

-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     username VARCHAR(50) NOT NULL,
                                     email VARCHAR(100) NOT NULL,
                                     password     VARCHAR(20) NOT NULL ,
                                     role VARCHAR(20) DEFAULT 'user',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer des données de test
                                              INSERT INTO users (username, email, password, role) VALUES
                                                ('kodjo_aklesso',   'kodjo.aklesso@example.tg',   'adminpass1', 'admin'),
                                                ('kossi_anani',     'kossi.anani@example.tg',     'userpass2',  'user'),
                                                ('mawuena_abla',    'mawuena.abla@example.tg',    'userpass3',  'user'),
                                                ('komlan_attiogbe', 'komlan.attiogbe@example.tg', 'modpass4',   'moderator');

-- Créer la table comments pour la démo SQLi Stockée
CREATE TABLE IF NOT EXISTS comments (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        username VARCHAR(100) NOT NULL,
                                        comment TEXT NOT NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
