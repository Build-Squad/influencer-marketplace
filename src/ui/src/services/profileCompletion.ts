export const getProfileCompletedStatus = (businessDetails: any): string => {
    if (!businessDetails) {
      return "-";
    }
  
    let count = 0;
  
    const fields = [
      { key: 'is_twitter_connected', weight: 5 },
      { key: 'is_wallet_connected', weight: 5 },
      'business_name',
      'industry',
      'founded',
      'headquarters',
      'bio',
      'user_email',
      'phone',
      'website',
      'twitter_account',
      'linked_in',
    ];
  
    fields.forEach((field) => {
      if (typeof field === 'string') {
        if (!!businessDetails[field]) {
          count++;
        }
      } else {
        if (businessDetails[field.key]) {
          count += field.weight;
        }
      }
    });
    console.log(count)
    return `${count} / 20`;
  };
  