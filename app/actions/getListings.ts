import prisma from '@/app/libs/prismadb'

export interface IListingParams{
    userId?:string,
    guestCount?:number,
    roomCount?:number,
    bathroomCount?:number,
    startDate?:string,
    endDate?:string,
    locationValue?:string,
    category?:string
}

export default async function getListings(
    params :IListingParams
) {
    
    try {
        const {userId,guestCount,roomCount,bathroomCount,startDate,endDate,locationValue,category} =params

        let query : any={};
        
        if(userId){
            query.userId=userId
        }
        if(guestCount){
            query.guestCount={
                gte: +guestCount
                }
        }
        if(roomCount){
            query.roomCount={
            gte: +roomCount
            }
        }
        if(category){
            query.category=category
        }
        if(bathroomCount){
            query.bathroomCount={
                gte: +bathroomCount
            }
        }
        if(locationValue){
            query.locationValue = locationValue
        }
        
        if(startDate && endDate){
            query.NOT ={
                reservations:{
                    some:{
                        OR:[
                            {
                            enddate: {gte: startDate},
                            startDate: {lte: startDate}
                        },
                        {
                            startDate :{lte: endDate},
                            enddate: {gte : endDate}
                        }
                    ]
                    }
                }
            }
        }


        const listings = await prisma?.listing.findMany({
            where:query,
            orderBy:{
                createdAt:"desc",
            }
        });
        if(!listings){
            return null
        }
        return(listings)
    } catch (error:any) {
        throw new Error(error)
    }
}