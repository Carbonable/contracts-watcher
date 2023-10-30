import * as Tabs from '@radix-ui/react-tabs';
import Addresses from './attributes/Addresses';
import Sale from './attributes/Sale';
import Yield from './attributes/Yield';
import Offset from './attributes/Offset';
import Project from './attributes/Project';

export default function ContractsTabs() {
    const triggerClassName = 'px-6 py-3 flex-1 flex items-center justify-start text-lg text-neutral-200 border-b-[1px] border-opacityLight-5 hover:text-neutral-100 hover:cursor-pointer data-[state=active]:text-neutral-100 data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-greenish-500';
    const contentClassName = 'grow py-6 outline-none w-full flex-wrap whitespace-nowrap';
    return (
        <Tabs.Root defaultValue="project" className='flex flex-col mt-8 w-full'>
            <Tabs.List className="shrink-0">
                <div className='w-full flex overflow-x-scroll'>
                    <Tabs.Trigger value="addresses" className={triggerClassName}>Addresses</Tabs.Trigger>
                    <Tabs.Trigger value="project" className={triggerClassName}>Project</Tabs.Trigger>
                    <Tabs.Trigger value="minter" className={triggerClassName}>Minter</Tabs.Trigger>
                    <Tabs.Trigger value="yielder" className={triggerClassName}>Yielder</Tabs.Trigger>
                    <Tabs.Trigger value="offseter" className={triggerClassName} >Offseter</Tabs.Trigger>
                </div>
                <div className='w-full'>
                    <Tabs.Content value="addresses" className={contentClassName}><Addresses /></Tabs.Content>
                    <Tabs.Content value="project" className={contentClassName}><Project /></Tabs.Content>
                    <Tabs.Content value="minter" className={contentClassName}><Sale /></Tabs.Content>
                    <Tabs.Content value="yielder" className={contentClassName}><Yield /></Tabs.Content>
                    <Tabs.Content value="offseter" className={contentClassName}><Offset /></Tabs.Content>
                </div>
            </Tabs.List>
        </Tabs.Root>
    );
}