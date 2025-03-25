import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useWalletContext } from '../context/WalletContext';
import { FaHeart, FaUpload, FaTrophy, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const MemesSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.theme.primary};
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 2rem;
  text-align: center;
`;

const ContestInfo = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  padding: 1.5rem;
  border-radius: 15px;
  max-width: 800px;
  margin: 0 auto 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ContestTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
  
  svg {
    font-size: 1.5rem;
  }
`;

const UploadSection = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 2rem;
  background: ${props => props.theme.cardBackground};
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid ${props => props.theme.secondary};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    border-color: ${props => props.theme.primary};
    outline: none;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin: 1rem 0;
  border-radius: 8px;
`;

const MemeGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const MemeCard = styled(motion.div)`
  position: relative;
  background: ${props => props.theme.cardBackground};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const MemeImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const MemeInfo = styled.div`
  padding: 1rem;
  background: ${props => props.theme.cardBackground};
`;

const WalletAddress = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LikeButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.$liked ? props.theme.primary : 'transparent'};
  color: ${props => props.$liked ? 'white' : props.theme.text};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const LikeCount = styled.span`
  font-weight: 600;
  margin-left: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin-top: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const WalletInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.theme.secondary};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  margin: 1rem 0;
  
  &:focus {
    border-color: ${props => props.theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.primary}33;
  }

  &::placeholder {
    color: ${props => props.theme.text}88;
  }
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const LoginButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const LoginModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.cardBackground};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 2px solid ${props => props.theme.secondary};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    border-color: ${props => props.theme.primary};
    outline: none;
  }
`;

const Memes = () => {
  const { theme } = useContext(ThemeContext);
  const { user, login, logout } = useAuth();
  const { isConnected, walletAddress, disconnectWallet, connecting } = useWalletContext();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});
  const [userIP, setUserIP] = useState('');
  const [manualWalletAddress, setManualWalletAddress] = useState('');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const fileInputRef = useRef(null);
  const [uploadData, setUploadData] = useState({
    image: null,
    preview: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    fetchMemes();
    // Set up real-time subscription
    const channel = supabase
      .channel('memes-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'memes'
        },
        (payload) => {
          setMemes(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'memes'
        },
        (payload) => {
          setMemes(prev => prev.map(meme => 
            meme.id === payload.new.id ? payload.new : meme
          ));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected && walletAddress && !user) {
      login(walletAddress);
    }
  }, [isConnected, walletAddress, user, login]);

  // Get user's IP address on component mount
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (err) {
        console.error('Error getting IP:', err);
      }
    };
    getIP();
  }, []);

  const fetchMemes = async () => {
    try {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Initialize like counts
      const counts = {};
      data.forEach(meme => {
        counts[meme.id] = meme.likes || 0;
      });

      setLikeCounts(counts);
      setMemes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (memeId) => {
    if (!userIP) return;

    try {
      // Get current meme data
      const { data: meme, error: fetchError } = await supabase
        .from('memes')
        .select('*')
        .eq('id', memeId)
        .single();

      if (fetchError) throw fetchError;

      const newCount = (meme.likes || 0) + 1;

      // Update local state immediately for better UX
      setLikeCounts(prev => ({ ...prev, [memeId]: newCount }));

      // Update meme likes count
      const { error: updateError } = await supabase
        .from('memes')
        .update({ likes: newCount })
        .eq('id', memeId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating like:', err);
      // Revert local state on error
      setLikeCounts(prev => ({ ...prev, [memeId]: likeCounts[memeId] }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => setUploadData({ ...uploadData, preview: e.target.result });
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!manualWalletAddress) {
      setError('Please enter your wallet address');
      return;
    }

    if (!uploadData.preview) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert base64 to file
      const file = await fetch(uploadData.preview).then(res => res.blob());
      const fileName = `${Date.now()}-${manualWalletAddress.slice(0, 10)}.jpg`;
      
      // Upload image to Supabase Storage
      const { data: uploadResult, error: uploadError } = await supabase
        .storage
        .from('memes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('memes')
        .getPublicUrl(fileName);

      // Add meme to database
      const { error: dbError } = await supabase
        .from('memes')
        .insert([{
          image_url: urlData.publicUrl,
          wallet_address: manualWalletAddress,
          likes: 0
        }]);

      if (dbError) throw dbError;

      // Reset form
      setUploadData({
        image: null,
        preview: null
      });
      setManualWalletAddress('');
      fileInputRef.current.value = '';
      setError('');
    } catch (error) {
      console.error('Error uploading meme:', error);
      setError('Failed to upload meme. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    logout();
  };

  return (
    <MemesSection id="memes" ref={ref}>
      <TitleContainer>
        <SectionTitle
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Namaste Meme Contest
        </SectionTitle>
      </TitleContainer>

      {!isConnected ? (
        <LoginButton
          theme={theme}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignInAlt /> Connect Wallet to Participate
        </LoginButton>
      ) : (
        <LoginButton
          theme={theme}
          onClick={handleDisconnect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignOutAlt /> Disconnect Wallet
        </LoginButton>
      )}

      <Description
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Show us your best Namaste Cat memes! The most liked meme will win awesome rewards.
      </Description>

      <ContestInfo
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ContestTitle theme={theme}>
          <FaTrophy /> Current Contest
        </ContestTitle>
        <p>🏆 Prize Pool: 100,000 NAMASTE tokens</p>
        <p>📅 Contest ends: December 31st, 2023</p>
        <p>🎨 Theme: Create the funniest Namaste Cat meme</p>
      </ContestInfo>

      <UploadSection
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <UploadForm onSubmit={handleSubmit}>
          <WalletInput
            type="text"
            placeholder="Enter your wallet address"
            value={manualWalletAddress}
            onChange={(e) => setManualWalletAddress(e.target.value)}
            required
          />
          
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
          
          <UploadButton
            type="button"
            theme={theme}
            onClick={() => fileInputRef.current.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isConnected || connecting}
          >
            <FaUpload /> {connecting ? 'Connecting Wallet...' : 'Select Meme Image'}
          </UploadButton>
          
          {uploadData.preview && (
            <PreviewImage src={uploadData.preview} alt="Preview" />
          )}
          
          {error && <ErrorText>{error}</ErrorText>}
          
          <UploadButton
            type="submit"
            theme={theme}
            disabled={!uploadData.preview || !isConnected || connecting || uploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {uploading ? (
              <>
                <LoadingSpinner /> Uploading...
              </>
            ) : connecting ? (
              'Connecting Wallet...'
            ) : (
              'Submit Meme'
            )}
          </UploadButton>
        </UploadForm>
      </UploadSection>

      <MemeGrid
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {memes.map((meme) => (
          <MemeCard
            key={meme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemeImage src={meme.image_url} alt="Meme" />
            <MemeInfo>
              <WalletAddress>
                {truncateAddress(meme.wallet_address)}
              </WalletAddress>
              <LikeButton
                onClick={() => handleLike(meme.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart />
                <LikeCount>{likeCounts[meme.id] || 0}</LikeCount>
              </LikeButton>
            </MemeInfo>
          </MemeCard>
        ))}
      </MemeGrid>
    </MemesSection>
  );
};

export default Memes; 