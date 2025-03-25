import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket for memes
export const MEMES_BUCKET = 'memes';

// Helper function to get image URL
export const getImageUrl = (path) => {
  const { data } = supabase.storage.from(MEMES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to upload image
export const uploadImage = async (file, path) => {
  const { data, error } = await supabase.storage
    .from(MEMES_BUCKET)
    .upload(path, file);

  if (error) throw error;
  return data;
};

// Helper function to fetch memes
export const fetchMemes = async () => {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Helper function to add a new meme
export const addMeme = async ({ image_url, wallet_address }) => {
  const { data, error } = await supabase
    .from('memes')
    .insert([{ image_url, wallet_address, likes: 0 }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Helper function to toggle like
export const toggleLike = async (memeId, walletAddress) => {
  // First, check if the user has already liked this meme
  const { data: existingLike } = await supabase
    .from('meme_likes')
    .select()
    .match({ meme_id: memeId, wallet_address: walletAddress })
    .single();

  if (existingLike) {
    // Unlike
    await supabase
      .from('meme_likes')
      .delete()
      .match({ meme_id: memeId, wallet_address: walletAddress });
    
    await supabase.rpc('decrement_likes', { meme_id: memeId });
    return false;
  } else {
    // Like
    await supabase
      .from('meme_likes')
      .insert({ meme_id: memeId, wallet_address: walletAddress });
    
    await supabase.rpc('increment_likes', { meme_id: memeId });
    return true;
  }
}; 