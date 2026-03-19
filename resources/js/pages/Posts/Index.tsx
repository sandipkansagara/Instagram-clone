import AppLayout from '@/layouts/app-layout';
import Create from './Create';

const Index = () => {
    return (
        <AppLayout>
            <Create />
            <div>
                <h1>Posts</h1>
            </div>
        </AppLayout>
    );
};

export default Index;
