module krushi_chain {
    struct LandRecord has key, store {
        land_id: String,
        farmer_name: String,
        area: u64,
        crop_type: String,
        location: String,
        timestamp: u64,
    }
    
    public entry fun register_land(
        account: &signer,
        land_id: String,
        farmer_name: String,
        area: u64,
        crop_type: String,
        location: String
    ) {
        // Land registration logic
    }
    
    public entry fun check_subsidy_eligibility(
        farmer_address: address
    ): bool {
        // Subsidy eligibility logic
    }
}