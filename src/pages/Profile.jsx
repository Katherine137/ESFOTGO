import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'


const Profile = () => {
    return (
        <>       
            <div>
                <h1 className='font-black text-4xl text-blue-950'>Perfil</h1>
                <br />
            </div>

            <div className="flex justify-center w-full">
                <div className="w-full md:w-1/2">
                    <CardProfile/>
                </div>
            </div>

            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>

                
                <div className='w-full md:w-1/2'>
                    <FormProfile/>
                </div>

                <div className='w-full md:w-1/2'>                    
                    <CardPassword/>
                </div>


            </div>
        </>

    )
}

export default Profile