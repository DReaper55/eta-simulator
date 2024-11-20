function getRandomId(length?: number) {
  if(!length){
    length = 9;
  }

  let randomId = '';
  const characters = '0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
  
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return randomId;
}

export default getRandomId;
