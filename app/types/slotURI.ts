type Attribute = {
    trait_type: string;
    value: string;
    display_type?: string;
}

export type SlotURI = {
    project?: string;
    projectSlot?: string;
    collectionId?: string;
    name: string;
    image_data?: string;
    image?: string;
    youtube_url: string;
    description: string;
    external_url: string;
    banner_image_url: string;
    attributes: Attribute[];
}