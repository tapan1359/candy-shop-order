### Renew certificate
- open port 80 and 443
- Run `sudo certbot --nginx -d  -d www.thecandystoreonline.store`

### deploy
- ./deploy.sh ~/Downloads/CandyStore.pem <IP> <store hash> <token>

### Notes:
#### Create New Customer:
- If `Create Default Address` is enabled then it adds the following address by default
```
first_name: newCustomer.first_name,
last_name: newCustomer.last_name,
address1: '123 Main St',
city: 'Baltimore',
state_or_province: 'Maryland',
postal_code: '21201',
country_code: 'US',
```

#### Create New Address:
- If `Local Delivery` is enabled then it adds the following address by default
```
city = 'Baltimore';
state_or_province = 'Maryland';
postal_code = '21201';
```