function extractHashtags(description) {
    
    const hashtags = description.match(/#(\w+)/g);
   
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
  };
  
module.exports={extractHashtags};