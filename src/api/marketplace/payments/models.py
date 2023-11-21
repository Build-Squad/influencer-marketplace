from django.db import models

# class Wallet(models.Model):
#   user = models.OneToOneField(User, on_delete=models.CASCADE)
#   coinbase_wallet_address = models.CharField(max_length=42, blank=True, null=True)
#   coinbase_wallet_connected = models.BooleanField(default=False)

# class Transaction(models.Model):
#   buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_transactions')
#   seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seller_transactions')
#   order = models.ForeignKey(Product, on_delete=models.CASCADE)
#   escrow_address = models.CharField(max_length=42) # Ethereum address for escrow smart contract
#   buyer_coinbase_wallet = models.CharField(max_length=42, blank=True, null=True) # Coinbase wallet address of the buyer
#   amount = models.DecimalField(max_digits=10, decimal_places=2)
#   status = models.CharField(max_length=20, choices=[('Initiated', 'Initiated'), ('Completed', 'Completed'), ('Refunded', 'Refunded')])
#   created_at = models.DateTimeField(auto_now_add=True)  

# class EscrowContract(models.Model):
#   transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE)
#   smart_contract_address = models.CharField(max_length=42)  
