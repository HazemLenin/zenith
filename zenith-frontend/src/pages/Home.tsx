import React from "react";
export const Home: React.FC = () => {
  return (  
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-black mb-8">Color Palette</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-primary" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">Primary</h3>
              <p className="text-secondary-title">primary</p>
              <p className="text-black">#2a5c8a</p>
            </div>
          </div>

          {/* Primary Disabled */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-primary-disabled" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">
                Primary Disabled
              </h3>
              <p className="text-secondary-title">primary-disabled</p>
              <p className="text-black">#94adc4</p>
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-warning" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">Warning</h3>
              <p className="text-secondary-title">warning</p>
              <p className="text-black">#ff9800</p>
            </div>
          </div>

          {/* Background */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-background" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">Background</h3>
              <p className="text-secondary-title">background</p>
              <p className="text-black">#e3f2fd</p>
            </div>
          </div>

          {/* Secondary Title */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-secondary-title" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">
                Secondary Title
              </h3>
              <p className="text-secondary-title">secondary-title</p>
              <p className="text-black">#2f327d</p>
            </div>
          </div>

          {/* Footer Background */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-footer-bg" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">
                Footer Background
              </h3>
              <p className="text-secondary-title">footer-bg</p>
              <p className="text-black">#252641</p>
            </div>
          </div>

          {/* Footer Title */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-footer-title" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">Footer Title</h3>
              <p className="text-secondary-title">footer-title</p>
              <p className="text-black">#69698</p>
            </div>
          </div>

          {/* Black */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-black" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">Black</h3>
              <p className="text-secondary-title">black</p>
              <p className="text-black">#333333</p>
            </div>
          </div>

          {/* White */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-white border border-gray-200" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">White</h3>
              <p className="text-secondary-title">white</p>
              <p className="text-black">#ffffff</p>
            </div>
          </div>

          {/* Danger */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="h-32 bg-danger" />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-black">Danger</h3>
              <p className="text-secondary-title">danger</p>
              <p className="text-black">#ff6b6b</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
