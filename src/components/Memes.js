import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';
import { FaHeart, FaUpload, FaTrophy } from 'react-icons/fa';
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

const Memes = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [memes, setMemes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    loadMemes();
    
    // Subscribe to real-time updates
    const memesSubscription = supabase
      .channel('public:memes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memes' }, handleMemeChange)
      .subscribe();

    return () => {
      supabase.removeChannel(memesSubscription);
    };
  }, []);

  const loadMemes = async () => {
    try {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemes(data || []);
    } catch (error) {
      console.error('Error loading memes:', error);
      setError('Failed to load memes. Please try again later.');
    }
  };

  const handleMemeChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setMemes(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setMemes(prev => prev.map(meme => 
        meme.id === payload.new.id ? payload.new : meme
      ));
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
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewImage || !walletAddress) {
      setError('Please fill in all fields');
      return;
    }

    if (!walletAddress.startsWith('addr1')) {
      setError('Please enter a valid Cardano wallet address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Convert base64 to file
      const file = await fetch(previewImage).then(res => res.blob());
      const fileName = `${Date.now()}-${walletAddress.slice(0, 10)}.jpg`;
      
      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
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
          wallet_address: walletAddress,
          likes: 0
        }]);

      if (dbError) throw dbError;

      // Reset form
      setPreviewImage(null);
      setWalletAddress('');
      fileInputRef.current.value = '';
      setError('');
    } catch (error) {
      console.error('Error uploading meme:', error);
      setError('Failed to upload meme. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (memeId, currentLikes, isLiked) => {
    if (!walletAddress) {
      setError('Please enter your wallet address to like memes');
      return;
    }

    try {
      const { error } = await supabase
        .from('meme_likes')
        .upsert([
          {
            meme_id: memeId,
            wallet_address: walletAddress,
            liked: !isLiked
          }
        ], { onConflict: ['meme_id', 'wallet_address'] });

      if (error) throw error;

      // Update likes count
      await supabase
        .from('memes')
        .update({ likes: isLiked ? currentLikes - 1 : currentLikes + 1 })
        .eq('id', memeId);

    } catch (error) {
      console.error('Error updating like:', error);
      setError('Failed to update like. Please try again.');
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  return (
    <MemesSection id="memes" ref={ref}>
      <TitleContainer>
        <SectionTitle
          theme={currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Namaste Meme Contest
        </SectionTitle>
      </TitleContainer>

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
        <ContestTitle theme={currentTheme}>
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
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
          
          <UploadButton
            type="button"
            theme={currentTheme}
            onClick={() => fileInputRef.current.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaUpload /> Select Meme Image
          </UploadButton>
          
          {previewImage && (
            <PreviewImage src={previewImage} alt="Preview" />
          )}
          
          <WalletInput
            type="text"
            placeholder="Enter your Cardano wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            theme={currentTheme}
          />
          
          {error && <ErrorText>{error}</ErrorText>}
          
          <UploadButton
            type="submit"
            theme={currentTheme}
            disabled={!previewImage || !walletAddress || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner /> Uploading...
              </>
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
            theme={currentTheme}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 }
              }
            }}
          >
            <MemeImage src={meme.image_url} alt="Contest Meme" />
            <MemeInfo theme={currentTheme}>
              <WalletAddress theme={currentTheme}>
                {truncateAddress(meme.wallet_address)}
              </WalletAddress>
              <LikeButton
                theme={currentTheme}
                $liked={meme.liked}
                onClick={() => handleLike(meme.id, meme.likes, meme.liked)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart /> <LikeCount>{meme.likes}</LikeCount>
              </LikeButton>
            </MemeInfo>
          </MemeCard>
        ))}
      </MemeGrid>
    </MemesSection>
  );
};

export default Memes; 