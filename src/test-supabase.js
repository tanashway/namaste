const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://namastedb.lucidsro.com';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MjkxMTk4MCwiZXhwIjo0ODk4NTg1NTgwLCJyb2xlIjoiYW5vbiJ9.gd6zyITk-0S8N9Vs7oBN5RC-wCUhDKeCA5TRE2v6UTU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test database connection
    const { data: memes, error: memesError } = await supabase
      .from('memes')
      .select('*');
    
    if (memesError) throw memesError;
    console.log('Successfully connected to database!');
    console.log('Memes:', memes);

    // Test storage connection
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) throw bucketsError;
    console.log('Successfully connected to storage!');
    console.log('Buckets:', buckets);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testConnection(); 