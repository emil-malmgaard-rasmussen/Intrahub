export interface CreateCompanyDto {
    companyName?: string;
    vatNumber?: number;
    phone?: number;
    email?: string;
    type?: CompanyType;
    address?: string;
    zipcode?: number;
    city?: string;
}

export enum CompanyType {
    Bricklayer = 'Bygge- og anlægsbranchen/Murer',
    Carpenter = 'Bygge- og anlægsbranchen/Tømrer',
    Electrician = 'Bygge- og anlægsbranchen/Elektriker',
    Plumber = 'Bygge- og anlægsbranchen/VVS-installatør',
    Architect = 'Bygge- og anlægsbranchen/Arkitekt',
    LandscapeArchitect = 'Bygge- og anlægsbranchen/Landskabsarkitekt',
    Painter = 'Bygge- og anlægsbranchen/Maler',
    RoofingContractor = 'Bygge- og anlægsbranchen/Tagdækker',
    FlooringContractor = 'Bygge- og anlægsbranchen/Gulvbelægning',
    HVACContractor = 'Bygge- og anlægsbranchen/Ventilationsarbejde',
    ConstructionManager = 'Bygge- og anlægsbranchen/Byggeledelse',

    Supermarket = 'Detailhandel/Supermarked',
    ClothingStore = 'Detailhandel/Tøjbutik',
    ElectronicsStore = 'Detailhandel/Elektronikforretning',
    Bookstore = 'Detailhandel/Boghandel',
    FurnitureStore = 'Detailhandel/Møbelbutik',
    HardwareStore = 'Detailhandel/Byggemarked',

    Hospital = 'Sundhedssektoren/Hospital',
    MedicalPractice = 'Sundhedssektoren/Lægepraksis',
    DentalClinic = 'Sundhedssektoren/Tandlægeklinik',
    Pharmacy = 'Sundhedssektoren/Apotek',
    PhysiotherapyClinic = 'Sundhedssektoren/Fysioterapi-klinik',
    Psychotherapist = 'Sundhedssektoren/Psykoterapeut',

    SoftwareDevelopmentFirm = 'Informationsteknologi og softwareudvikling/Softwareudviklingsfirma',
    ITConsultant = 'Informationsteknologi og softwareudvikling/IT-konsulent',
    WebDesignAgency = 'Informationsteknologi og softwareudvikling/Webdesignbureau',
    CloudServiceProvider = 'Informationsteknologi og softwareudvikling/Cloud-tjenesteudbyder',
    ECommercePlatform = 'Informationsteknologi og softwareudvikling/E-handelsplatform',
    DataMiningOperations = 'Informationsteknologi og softwareudvikling/Dataminedrift',

    Agriculture = 'Fødevareindustrien/Landbrug',
    FoodProduction = 'Fødevareindustrien/Fødevareproduktion',
    Restaurant = 'Fødevareindustrien/Restaurant',
    CateringCompany = 'Fødevareindustrien/Cateringvirksomhed',
    FoodRetail = 'Fødevareindustrien/Fødevaredetailhandel',
    FoodPackagingProduction = 'Fødevareindustrien/Fødevareemballageproduktion',

    Bank = 'Finanssektoren/Bank',
    InsuranceCompany = 'Finanssektoren/Forsikringsselskab',
    InvestmentFund = 'Finanssektoren/Investeringsfond',
    AuditFirm = 'Finanssektoren/Revisionsfirma',
    MortgageNote = 'Finanssektoren/Pantebrev',
    CreditUnion = 'Finanssektoren/Kreditforening',

    FreightCompany = 'Transport og logistik/Fragtfirma',
    Airport = 'Transport og logistik/Lufthavn',
    ShippingCompany = 'Transport og logistik/Rederi',
    RailwayTransport = 'Transport og logistik/Jernbanetransport',
    PostalAndCourierService = 'Transport og logistik/Post- og kurertjeneste',
    WarehouseCompany = 'Transport og logistik/Lagerfirma',

    School = 'Uddannelsessektoren/Skole',
    University = 'Uddannelsessektoren/Universitet',
    VocationalSchool = 'Uddannelsessektoren/Erhvervsskole',
    LanguageSchool = 'Uddannelsessektoren/Sprogskole',
    TrainingCenter = 'Uddannelsessektoren/Kursuscenter',
    Kindergarten = 'Uddannelsessektoren/Børnehave',

    ElectricityProduction = 'Energisektoren/Elektricitetsproduktion',
    NaturalGasSupply = 'Energisektoren/Naturgasforsyning',
    RenewableEnergy = 'Energisektoren/Vedvarende energi',
    EnergyManagement = 'Energisektoren/Energiforvaltning',
    UtilityCompany = 'Energisektoren/Forsyningsselskab',
    OilSupply = 'Energisektoren/Olieforsyning',

    ManagementConsultant = 'Konsulentvirksomheder/Managementkonsulent',
    MarketingAgency = 'Konsulentvirksomheder/Marketingbureau',
    LegalConsultingFirm = 'Konsulentvirksomheder/Juridisk rådgivningsfirma',
    HRConsultant = 'Konsulentvirksomheder/HR-konsulent',
    TechnologyConsultant = 'Konsulentvirksomheder/Teknologirådgiver',
    EnvironmentalConsultant = 'Konsulentvirksomheder/Miljørådgiver',
    BuildingConsultant = 'Konsulentvirksomheder/Bygningsrådgiver',
}
