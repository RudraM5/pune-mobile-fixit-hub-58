              <TabsContent value="area" className="space-y-6">
                <AreaSearch onShopSelect={handleShopSelect} />
              </TabsContent>
              <TabsContent value="details" className="space-y-6">
                <CustomerDetails
                  customerInfo={customerInfo}
                  onUpdate={updateCustomerInfo}
                />
              </TabsContent>
            </Tabs>
          </div>
          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <BookingCart
              cart={cart}
              totalItems={getTotalItems()}
              totalPrice={getTotalPrice()}
              selectedDevice={selectedDevice}
              selectedShop={selectedShop}
              onRemoveFromCart={handleServiceRemove}
              onBooking={handleBooking}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookRepairPage;
