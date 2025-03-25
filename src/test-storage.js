const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://namastedb.lucidsro.com';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MjkxMTk4MCwiZXhwIjo0ODk4NTg1NTgwLCJyb2xlIjoiYW5vbiJ9.gd6zyITk-0S8N9Vs7oBN5RC-wCUhDKeCA5TRE2v6UTU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a simple test image
const createTestImage = () => {
  const testDir = path.join(__dirname, 'test');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  
  const testFile = path.join(testDir, 'test.jpg');
  // Create a 1x1 pixel black JPEG
  const minimalJPEG = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00,
    0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x03, 0xFF, 0xC4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0x37,
    0xFF, 0xD9
  ]);
  
  fs.writeFileSync(testFile, minimalJPEG);
  return testFile;
};

async function testStorage() {
  let testFile = null;
  try {
    console.log('1. Testing bucket existence...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) throw bucketsError;
    console.log('Available buckets:', buckets.map(b => b.name));

    console.log('\n2. Creating test image...');
    testFile = createTestImage();
    const fileData = fs.readFileSync(testFile);
    console.log('Test image created:', testFile);
    
    console.log('\n3. Testing upload...');
    const fileName = `test-${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('memes')
      .upload(fileName, fileData, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return;
    }
    console.log('Upload successful:', uploadData);

    console.log('\n4. Getting public URL...');
    const { data: urlData } = supabase
      .storage
      .from('memes')
      .getPublicUrl(fileName);
    console.log('Public URL:', urlData.publicUrl);

    console.log('\n5. Testing file listing...');
    const { data: files, error: listError } = await supabase
      .storage
      .from('memes')
      .list();
    
    if (listError) throw listError;
    console.log('Files in bucket:', files);

    console.log('\n6. Testing file deletion...');
    const { error: deleteError } = await supabase
      .storage
      .from('memes')
      .remove([fileName]);
    
    if (deleteError) throw deleteError;
    console.log('File deleted successfully');

    console.log('\nAll tests completed successfully! 🎉');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Clean up local test file
    if (testFile) {
      try {
        fs.unlinkSync(testFile);
        fs.rmdirSync(path.dirname(testFile));
        console.log('\nLocal test files cleaned up');
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError.message);
      }
    }
  }
}

testStorage(); 