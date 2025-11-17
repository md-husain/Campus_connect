import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import PostCard from '../components/Cards/PostCard';
import Sidebar from '../components/Common/Sidebar';
import UniversityInfo from '../components/UniversityInfo'; // Add this import
import { useNavigate } from 'react-router-dom';
