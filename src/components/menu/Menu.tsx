import { menu, settingsMenuItem } from './data';
import MenuItem from './MenuItem';

const Menu = () => {
  return (
    <div className="hidden xl:flex fixed top-0 left-0 z-[2] h-screen w-[260px] bg-white text-gray-800 dark:bg-base-200 dark:text-neutral-200 flex-col px-4 py-6 shadow-md">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl text-primary">🌟</span>
          <span className="text-xl font-bold">GFashion Dashboard</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2">
        {menu.map((item, index) => (
          <MenuItem
            key={index}
            catalog={item.catalog}
            listItems={item.listItems}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-300 dark:border-gray-600 mt-auto">
        <MenuItem
          catalog=""
          listItems={settingsMenuItem.listItems}
        />
      </div>
    </div>
  );
};

export default Menu;
